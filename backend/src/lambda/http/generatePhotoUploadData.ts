import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getPresignedUrl } from '../../businessLogic/Photos'

const logger = createLogger('generate_photo_upload_data_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)

  
    try{
      const uploadData = await getPresignedUrl()
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(uploadData)
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
  