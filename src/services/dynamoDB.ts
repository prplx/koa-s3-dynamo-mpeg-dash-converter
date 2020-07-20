import AWS from 'aws-sdk';
import config from '../config';
import { PromiseResult } from 'aws-sdk/lib/request';
import { State, DBItem } from '../types';

const DynamoDB = new AWS.DynamoDB(config.aws.dynamoDB);

class Dynamo {
  private dc: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.dc = new AWS.DynamoDB.DocumentClient({
      service: DynamoDB,
      region: config.aws.dynamoDB.region,
    });
  }

  query(
    fileUrl: string
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>
  > {
    const params = {
      TableName: config.aws.dynamoDB.table,
      KeyConditionExpression: '#file_url = :file_url',
      ExpressionAttributeNames: {
        '#file_url': 'file_url',
      },
      ExpressionAttributeValues: {
        ':file_url': fileUrl,
      },
    };
    return this.dc.query(params).promise();
  }

  put(
    fileUrl: string
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>
  > {
    const params = {
      TableName: config.aws.dynamoDB.table,
      Item: {
        file_url: fileUrl,
        state: 'started',
      },
    };

    return this.dc.put(params).promise();
  }

  private update(
    fileUrl: string,
    data: Partial<DBItem>
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>
  > {
    const keys = Object.keys(data);
    const params = {
      TableName: config.aws.dynamoDB.table,
      Key: {
        file_url: fileUrl,
      },
      UpdateExpression: `set ${keys
        .map(key => `#${key} = :${key}`)
        .join(', ')}`,
      ExpressionAttributeNames: keys.reduce(
        (acc, curr) => ({ ...acc, [`#${curr}`]: curr }),
        {}
      ),
      ExpressionAttributeValues: keys.reduce(
        (acc, curr) => ({ ...acc, [`:${curr}`]: data[curr] }),
        {}
      ),
    };
    return this.dc.update(params).promise();
  }

  updateState(
    fileUrl: string,
    state: State
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>
  > {
    return this.update(fileUrl, { state });
  }
}

export default new Dynamo();
