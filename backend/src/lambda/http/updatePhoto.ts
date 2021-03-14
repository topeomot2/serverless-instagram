import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { UpdatePhotoRequest } from '../../requests/UpdatPhotoRequest'
import { updatePhoto } from '../../businessLogic/Photos'

const logger = createLogger('get_update_todo_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const photoId = event.pathParameters.photoId
  const userId =  getUserId(event)
  const updatedPhoto: UpdatePhotoRequest = JSON.parse(event.body)

  try {

    const item = await updatePhoto(updatedPhoto, photoId, userId)
    logger.info('photo updated', { item })
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
    
  } catch (error) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
}