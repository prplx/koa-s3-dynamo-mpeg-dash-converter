import { dynamo, ffmpeg, cleaner, s3, logger } from './services';
import Queue, { Job } from 'bull';
import config from './config';
import { getS3ObjectKeyFromURL } from './helpers';

const converterQueue = new Queue('converterQueue', config.redisUrl);

const converterJob = (job: Job) =>
  new Promise(async (resolve, reject) => {
    const { url }: { url: string } = job.data;
    const objectKey = getS3ObjectKeyFromURL(url);

    if (!url) {
      return reject(new Error('Missing param `url` of `convert` job.'));
    }
    if (!objectKey) {
      return reject(new Error('Wrong `url` param format of `convert job.`'));
    }

    s3.headObject(objectKey, async (err, data) => {
      // File does not exist
      if (err)
        return (
          logger.error(`File ${url} does not exist in the S3 bucket`) &&
          resolve()
        );

      const etag = data.ETag;
      const pdbItem = await dynamo.query(url);

      await dynamo.updateState(url, 'done');
      const ndbItem = await dynamo.query(url);

      logger.info(`Putting '${url}' to DynamoDB`);
      await dynamo.put(url);

      logger.info(`Downloading '${url}' from S3`);
      const downloader = s3.downloadFile(objectKey);

      downloader.on('error', async error => {
        logger.error(`Downloader error with ${url}`, error);
        await cleaner.clean(objectKey);
        reject(error);
      });
      downloader.on('end', async () => {
        try {
          logger.info(`Converting file '${url}'`);
          await ffmpeg.convert(objectKey);

          logger.info(`Uploading dir of '${url}'`);
          const uploader = s3.uploadDir(objectKey);

          uploader.on('error', async error => {
            logger.error(`Uploader error with '${url}'`, error);
            await cleaner.clean(objectKey);
            reject(error);
          });
          uploader.on('end', async () => {
            logger.info(`All tasks done for '${url}'`);
            await cleaner.clean(objectKey);
            resolve();
          });
        } catch (error) {
          logger.error(`ffmpeg error with '${url}'`, error);
          await cleaner.clean(objectKey);
          reject(error);
        }
      });
    });
  });

converterQueue.process(converterJob);

export default converterQueue;
