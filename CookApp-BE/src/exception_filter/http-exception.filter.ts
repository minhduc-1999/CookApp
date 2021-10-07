import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { ResponseMetaDTO } from "base/dtos/responseMeta.dto";
import { classToPlain } from "class-transformer";
import { Response } from "express";
import e = require("express");

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message =
      process.env["APP_ENV"] === "producion"
        ? exception.message
        : exception.getResponse()["message"];
    const errorCode = exception.getResponse()['errorCode'] || undefined
    let meta: ResponseMetaDTO = exception.getResponse() as ResponseMetaDTO;
    if (!(meta instanceof ResponseMetaDTO)) {
      meta = new ResponseMetaDTO("failure", message, errorCode);
    }
    response.status(status).json(classToPlain(meta));
  }
}
