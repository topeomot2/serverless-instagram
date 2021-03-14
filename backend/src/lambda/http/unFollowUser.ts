import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { UnFollowUserRequest } from '../../requests/UnFollowRequest'
import { getUserId } from '../utils'
import { unFollow } from '../../businessLogic/Follow'

const logger = createLogger('follow_user_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const newUnFollow: UnFollowUserRequest = JSON.parse(event.body)
    const userId =  getUserId(event)
  
    try {
      
      const item = await unFollow(newUnFollow, userId)
      logger.info('new unfollow request successful', { item })
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