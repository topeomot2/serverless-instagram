import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { UserStatsItem } from '../models/UserStatsItem'

const XAWS = AWSXRay.captureAWS(AWS)
const userStatsTable = process.env.USER_STATS_TABLE

export default class UserStatsStore {
  docClient: DocumentClient

  constructor() {
    // @ts-ignore: Unreachable code error
    this.docClient = new XAWS.DynamoDB.DocumentClient()
  }

  async add(newUserStats: UserStatsItem): Promise<UserStatsItem> {
    await this.docClient
      .put({
        TableName: userStatsTable,
        Item: newUserStats
      })
      .promise()

    return newUserStats
  }

  async get(userId: string): Promise<UserStatsItem> {
    const result = await this.docClient
      .get({
        Key: { userId },
        TableName: userStatsTable
      })
      .promise()

    if (result && result.Item) return result.Item as UserStatsItem

    return null
  }

  async increaseFollows(userId: string, by: number = 1) {
    const response = await this.docClient
      .update({
        TableName: userStatsTable,
        Key: { userId },
        ExpressionAttributeNames: { '#V': 'follows' },
        UpdateExpression: 'set #V = if_not_exists(#V, :start) + :val',
        ExpressionAttributeValues: { ':val': by, ':start': 0 },
        ReturnValues: "UPDATED_NEW"
      })
      .promise()
      console.log(response)
      return response
  }


  async decreaseFollows(userId: string, by: number = 1) {
    const response = await this.docClient
      .update({
        TableName: userStatsTable,
        Key: { userId },
        ExpressionAttributeNames: { '#V': 'follows' },
        UpdateExpression: 'set #V = #V - :val',
        ExpressionAttributeValues: { ':val': by },
        ReturnValues: "UPDATED_NEW"
      })
      .promise()
      console.log(response)
      return response
  }

  async increase(stat: string, by: number, userId: string) {
    const response = await this.docClient
    .update({
      TableName: userStatsTable,
      Key: { userId },
      ExpressionAttributeNames: { '#V': stat },
      UpdateExpression: 'set #V = if_not_exists(#V, :start) + :val',
      ExpressionAttributeValues: { ':val': by, ':start': 0 },
      ReturnValues: "UPDATED_NEW"
    })
    .promise()
    console.log(response)
    return response
  }

  async decrease(stat: string, by: number, userId: string) {
    const response = await this.docClient
    .update({
      TableName: userStatsTable,
      Key: { userId },
      ExpressionAttributeNames: { '#V': stat },
      UpdateExpression: 'set #V = #V - :val',
      ExpressionAttributeValues: { ':val': by },
      ReturnValues: "UPDATED_NEW"
    })
    .promise()
    console.log(response)
    return response
  }
}
