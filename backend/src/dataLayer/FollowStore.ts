import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import * as AWSXRay from 'aws-xray-sdk'
import { FollowItem } from '../models/FollowItem'

// const XAWS = AWSXRay.captureAWS(AWS)
const followTable = process.env.FOLLOWS_TABLE
const followersIndex = process.env.FOLLOWERS_INDEX

export default class FollowStore {
    docClient: DocumentClient

    constructor() {
        this.docClient = new AWS.DynamoDB.DocumentClient()
    }

    async add(newFollow: FollowItem): Promise<FollowItem> {
        await this.docClient
        .put({
          TableName: followTable,
          Item: newFollow
        })
        .promise()
  
      return newFollow
    }

    async delete(userId: string, followedId: string): Promise<void> {
        await this.docClient.delete({
            TableName: followTable,
            Key: { userId, followedId }
          }).promise()
    
        return 
    }

    async getFollowers(userId: string): Promise<FollowItem[]> {
        const result  = await this.docClient.query({
            TableName : followTable,
            IndexName : followersIndex,
            KeyConditionExpression: 'followedId = :followedId',
            ExpressionAttributeValues: {
                ':followedId': userId
            },
            ScanIndexForward: false
          }).promise()
      
          if(result.Count > 0)return result.Items as FollowItem[]
      
          return []
    }

    async getFollowed(userId: string): Promise<FollowItem[]> {
        const result  = await this.docClient.query({
            TableName : followTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
          }).promise()
      
          if(result.Count > 0)return result.Items as FollowItem[]
      
          return []
    }
}