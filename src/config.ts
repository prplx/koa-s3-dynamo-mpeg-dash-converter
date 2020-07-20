import dotenv from 'dotenv';
import { getStringEnv } from 'env-guard';

dotenv.config({ path: '.env' });

interface Config {
  port: number;
  aws: {
    s3: {
      region: string;
      bucket: string;
      endpoint: string;
      accessKeyId: string;
      secretAccessKey: string;
      sslEnabled: boolean;
    };
    dynamoDB: {
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      table: string;
      sslEnabled: boolean;
    };
  };
  redisUrl: string;
}

const config: Readonly<Config> = {
  port: +(process.env.PORT || 3000),
  aws: {
    s3: {
      region: getStringEnv('AWS_S3_REGION'),
      bucket: getStringEnv('AWS_S3_BUCKET'),
      endpoint: getStringEnv('AWS_S3_ENDPOINT'),
      accessKeyId: getStringEnv('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: getStringEnv('AWS_S3_SECRET_ACCESS_KEY'),
      sslEnabled: true,
    },
    dynamoDB: {
      region: getStringEnv('AWS_DYNAMODB_REGION'),
      accessKeyId: getStringEnv('AWS_DYNAMODB_ACCESS_KEY_ID'),
      secretAccessKey: getStringEnv('AWS_DYNAMODB_SECRET_ACCESS_KEY'),
      table: getStringEnv('AWS_DYNAMODB_TABLE'),
      sslEnabled: true,
    },
  },
  redisUrl: getStringEnv('REDIS_URL'),
};

export default config;
