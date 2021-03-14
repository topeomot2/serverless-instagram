import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { FollowUserRequest } from '../../requests/FollowUserRequest'
import { getUserId } from '../utils'
import { follow } from '../../businessLogic/Follow'

const logger = createLogger('follow_user_lambda')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const newFollow: FollowUserRequest = JSON.parse(event.body)
    const userId =  getUserId(event)
  
    try {
      
      const item = await follow(newFollow, userId)
      logger.info('new follow created', { item })
      return {
        statusCode: 201,
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