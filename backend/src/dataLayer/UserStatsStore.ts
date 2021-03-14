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

    async increase(stat: string, by: number, userId: string) {
        try {
            const response = await this.docClient
            .update({
            TableName: userStatsTable,
            Key: { userId },
            UpdateExpression: `set ${stat} = if_not_exists(${stat}, :start)+ :incr`,
            ExpressionAttributeValues: {":incr":{"N":`${by}`}, ":start": 0},
            ReturnValues: 'UPDATED_NEW'
            })
            .promise()

            if(response.$response.error) {
                const createdAt = new Date().toISOString()
                let newItem = {
                    userId,
                    followers: 0,
                    follows: 0,
                    createdAt
                }

                newItem[`${stat}`] = by

                await this.add(newItem)
            }
  
        } catch (error) {
            
        }
        
      return
    }


    async decrease(stat: string, by: number, userId: string) {
      try {
          const response = await this.docClient
          .update({
          TableName: userStatsTable,
          Key: { userId },
          UpdateExpression: `set ${stat} = if_not_exists(${stat}, :start)- :incr`,
          ExpressionAttributeValues: {":incr":{"N":`${by}`}, ":start": by},
          ReturnValues: 'UPDATED_NEW'
          })
          .promise()

          if(response.$response.error) {
              const createdAt = new Date().toISOString()
              let newItem = {
                  userId,
                  followers: 0,
                  follows: 0,
                  createdAt
              }

              newItem[`${stat}`] = by

              await this.add(newItem)
          }

      } catch (error) {
          
      }
      
    return
  }
}