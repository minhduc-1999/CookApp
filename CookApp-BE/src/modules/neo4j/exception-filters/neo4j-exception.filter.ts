import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ResponseDTO } from 'base/dtos/response.dto';
import { Response } from 'express';
import { Neo4jError } from 'neo4j-driver';

@Catch(Neo4jError)
export class Neo4jErrorFilter implements ExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost) {
    console.log("neo4j error filter")
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let statusCode = 500
    // let error = 'Internal Server Error'
    let message: string = undefined

    // Neo.ClientError.Schema.ConstraintValidationFailed
    if (exception.message.includes('already exists with')) {
      statusCode = 400
      // error = 'Bad Request'

      const [, property] = exception.message.match(/`([a-z0-9]+)`/gi)
      message = `${property.replace(/`/g, '')} already taken`
    }
    // Neo.ClientError.Schema.ConstraintValidationFailed
    else if (exception.message.includes('must have the property')) {
      statusCode = 400
      // error = 'Bad Request'

      const [, property] = exception.message.match(/`([a-z0-9]+)`/gi)
      message = `${property.replace(/`/g, '')} should not be empty`
    }

    response
      .status(statusCode)
      .json(ResponseDTO.fail(message));
  }
}
