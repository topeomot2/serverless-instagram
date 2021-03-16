import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import * as AWSXRay from 'aws-xray-sdk'

import { PhotoItem } from '../models/PhotoItem'
import { UpdatePhotoRequest } from '../requests/UpdatPhotoRequest'

// const XAWS = AWSXRay.captureAWS(AWS)
const photosTable = process.env.PHOTOS_TABLE
const bucketName = process.env.PHOTOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const userIndex = process.env.USER_ID_INDEX

export default class PhotoStore {
  s3: S3
  docClient: DocumentClient

  constructor() {
    this.s3 = new AWS.S3({
      signatureVersion: 'v4' // Use Sigv4 algorithm
    })

    this.docClient = new AWS.DynamoDB.DocumentClient()
  }

  async add(newPhoto: PhotoItem): Promise<PhotoItem> {
    await this.docClient
      .put({
        TableName: photosTable,
        Item: newPhoto
      })
      .promise()

    return newPhoto
  }

  async update(
    photoId: string,
    userId: string,
    updatePhoto: UpdatePhotoRequest
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: photosTable,
        Key: { photoId, userId },
        UpdateExpression: 'set description=:description',
        ExpressionAttributeValues: {
          ':description': updatePhoto.description
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return
  }

  async get(photoId: string): Promise<PhotoItem> {
    const result = await this.docClient
      .get({
        Key: {
          photoId: {
            S: photoId
          }
        },
        TableName: photosTable
      })
      .promise()

    if (result && result.Item) return result.Item as PhotoItem

    return null
  }

  async getUserPhotos(userId?: string): Promise<PhotoItem[]> {
    const result = await this.docClient
      .query({
        TableName: photosTable,
        IndexName: userIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()

    if (result.Count > 0) return result.Items as PhotoItem[]

    return []
  }

  async getPhotos(): Promise<PhotoItem[]> {
    const result = await this.docClient
      .query({
        TableName: photosTable,
        ScanIndexForward: false
      })
      .promise()

    if (result.Count > 0) return result.Items as PhotoItem[]

    return []
  }

  getPhotoPresignedUrl(photoId: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: `${photoId}_image.png`,
      Expires: parseInt(urlExpiration)
    })
  }

  generatePhotoUrl(photoId: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${photoId}_image.png`
  }

  async increase(stat: string, by: number, photoId: string) {
    try {
      await this.docClient
        .update({
          TableName: photosTable,
          Key: { photoId },
          UpdateExpression: `set ${stat} = if_not_exists(${stat}, :start)+ :incr`,
          ExpressionAttributeValues: { ':incr': { N: `${by}` }, ':start': 0 },
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()
    } catch (error) {}

    return
  }

  async decrease(stat: string, by: number, photoId: string) {
    try {
      await this.docClient
        .update({
          TableName: photosTable,
          Key: { photoId },
          UpdateExpression: `set ${stat} = if_not_exists(${stat}, :start)- :incr`,
          ExpressionAttributeValues: { ':incr': { N: `${by}` }, ':start': by },
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()
    } catch (error) {}

    return
  }
}
