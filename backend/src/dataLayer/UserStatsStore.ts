import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import * as AWSXRay from 'aws-xray-sdk'
import { UserStatsItem } from '../models/UserStatsItem'

// const XAWS = AWSXRay.captureAWS(AWS)
const userStatsTable = process.env.USER_STATS_TABLE

export default class UserStatsStore {
  docClient: DocumentClient

  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient()
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
        Key: {
          userId: {
            S: userId
          }
        },
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
    try {
        const response = await this.docClient
        .update({
          TableName: userStatsTable,
          Key: { userId },
          ExpressionAttributeNames: { '#V': stat },
          UpdateExpression: 'set #V = #V + :val',
          ExpressionAttributeValues: {
            ':val': by
          }
        })
        .promise()
       console.log(response)   
    } catch (error) {}

    return
  }

  async decrease(stat: string, by: number, userId: string) {
    try {
      const response = await this.docClient
        .update({
          TableName: userStatsTable,
          Key: { userId },
          UpdateExpression: `set ${stat} = if_not_exists(${stat}, :start)- :incr`,
          ExpressionAttributeValues: { ':incr': { N: `${by}` }, ':start': by },
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()

      if (response.$response.error) {
        const createdAt = new Date().toISOString()
        let newItem = {
          userId,
          followers: 0,
          follows: 0,
          likes:0,
          views:0,
          createdAt
        }

        newItem[`${stat}`] = by

        await this.add(newItem)
      }
    } catch (error) {}

    return
  }
}
