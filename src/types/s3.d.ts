declare module '@auth0/s3' {
  import AWS from 'aws-sdk';
  import { EventEmitter } from 'events';

  export interface Options {
    maxAsyncS3?: number;
    s3RetryCount?: number;
    s3RetryDelay?: number;
    multipartUploadThreshold?: number;
    multipartUploadSize?: number;
    s3Options?: S3.ClientConfiguration;
    s3Client?: AWS.S3;
  }

  interface S3Params {
    Bucket: string;
    Key?: string;
    Prefix?: string;
  }

  interface HeadObjectParams extends S3Params {
    Key: string;
  }

  interface GetFileParams {
    localFile: string;
    s3Params: AWS.S3.Types.GetObjectRequest;
  }

  interface PutFileParams {
    localFile: string;
    s3Params: AWS.S3.Types.PutObjectRequest;
  }

  interface UploadDirParams {
    localDir: string;
    deleteRemoved?: boolean;
    s3Params: Omit<
      AWS.S3.Types.PutObjectRequest,
      'Key' | 'Body' | 'ContentLength'
    > & {
      Prefix: string;
    };
  }

  interface Client {
    s3: AWS.S3;
    downloadFile(params: GetFileParams): EventEmitter;
    uploadFile(params: PutFileParams): EventEmitter;
    uploadDir(params: UploadDirParams): EventEmitter;
    headObject(
      params: AWS.S3.HeadObjectRequest,
      cb: (err: AWS.AWSError, data: AWS.S3.HeadObjectOutput) => void
    );
  }

  export function createClient(options: Options): Client;
}
