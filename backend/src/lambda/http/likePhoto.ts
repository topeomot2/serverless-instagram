import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
// import { getUserId } from '../utils'
import { likePhoto } from '../../businessLogic/Photos'

const logger = createLogger('like_photo_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const photoId = event.pathParameters.photoId
    // onst userId =  getUserId(event)
  
    try {
      
      const response = await likePhoto(photoId)
      // logger.info('new photo like added', { photoId, userId })
      logger.info('new photo likes added', { response })
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