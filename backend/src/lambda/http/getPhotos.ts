import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserPhotos } from '../../businessLogic/Photos'
import { getUserId } from '../utils'

const logger = createLogger('get_photos_lambda')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId =  getUserId(event)
  
  const result = await getUserPhotos(userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({items: result})
    }

}
