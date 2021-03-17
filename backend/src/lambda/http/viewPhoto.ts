import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { viewPhoto } from '../../businessLogic/Photos'

const logger = createLogger('view_photo_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const photoId = event.pathParameters.photoId
    const userId =  getUserId(event)
  
    try {
      
      const response = await viewPhoto(photoId, userId)
      //logger.info('new photo view added', { photoId, userId })
      logger.info('new photo view added', { response })
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ''
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