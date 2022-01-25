import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { classToPlain } from "class-transformer";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("exception filter")
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message =
      process.env["APP_ENV"] === "production"
        ? exception.message
        : exception.getResponse()["message"];
    const errorCode = exception.getResponse()["errorCode"] || undefined;
    let responseDto: ResponseDTO<any> = exception.getResponse() as ResponseDTO<any>;

    if (!(responseDto instanceof ResponseDTO)) {
      responseDto = ResponseDTO.fail(message, errorCode);
    }
    response.status(status).json(classToPlain(responseDto))
  }
}
