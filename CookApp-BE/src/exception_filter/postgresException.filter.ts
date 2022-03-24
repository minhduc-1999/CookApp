import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { classToPlain } from "class-transformer";
import { Response } from "express";
import { parseInt } from "lodash";
import { QueryFailedError } from "typeorm";

export class TypeormException extends Error {
  private _error: QueryFailedError 

  constructor(error: QueryFailedError) {
    super()
    this._error = error
  }

  getResponse() {
    const detail = this._error?.driverError?.detail
    const code = parseInt(this._error?.driverError?.code)
    let response: ResponseDTO<any>;
    switch (code) {
      case 23505:
        response = ResponseDTO.fail(detail)
        break;
      default:
        break;
    }
    return response
  }

  getStatus(): number {
    if (this._error?.driverError?.code === 23505) {
      return 400
    }
    return 500
  }

}

@Catch(TypeormException)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: TypeormException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const resDto = exception.getResponse()
    response.status(status).json(classToPlain(resDto))
  }
}
