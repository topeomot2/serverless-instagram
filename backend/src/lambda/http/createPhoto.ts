import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
import { getUserId } from '../utils'
import { createPhoto } from '../../businessLogic/Photos'

const logger = createLogger('create_photo_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const newPhoto: CreatePhotoRequest = JSON.parse(event.body)
    const userId =  getUserId(event)
  
    try {
      
      const item = await createPhoto(newPhoto, userId)
      logger.info('new photo created', { item })
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item
        })
      }
    } catch (error) {
      logger.error('error', {error, event})
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
    }
  }