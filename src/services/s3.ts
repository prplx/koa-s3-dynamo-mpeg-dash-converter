import path from 'path';
import AWS from 'aws-sdk';
import s3, { Client } from '@auth0/s3';
import config from '../config';
import { EventEmitter } from 'events';
import { stripFileExtension } from '../helpers';

class S3 {
  private s3Client: Client;
  private bucket = config.aws.s3.bucket;

  constructor(AWSS3Instance: AWS.S3) {
    this.s3Client = s3.createClient({ s3Client: AWSS3Instance });
  }

  downloadFile(objectKey: string): EventEmitter {
    return this.s3Client.downloadFile({
      localFile: path.basename(objectKey),
      s3Params: {
        Bucket: this.bucket,
        Key: objectKey,
      },
    });
  }

  uploadDir(objectKey: string): EventEmitter {
    return this.s3Client.uploadDir({
      localDir: path.basename(stripFileExtension(objectKey) as string),
      s3Params: {
        Bucket: this.bucket,
        Prefix: stripFileExtension(objectKey) as string,
        ACL: 'public-read',
        // CacheControl: 'max-age=0',
      },
    });
  }

  headObject(
    objectKey: string,
    cb: (err: AWS.AWSError, data: AWS.S3.HeadObjectOutput) => void
  ) {
    return this.s3Client.s3.headObject(
      {
        Bucket: this.bucket,
        Key: objectKey,
      },
      cb
    );
  }
}

export default new S3(new AWS.S3(config.aws.s3));
