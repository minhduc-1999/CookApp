import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { WsRequestValidationError } from "base/errors/wsRequestError";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validateSync } from "class-validator";

@Injectable()
export class ParseHttpRequestPipe<T extends ClassConstructor<any>> implements PipeTransform<any, T> {
  transform(value: any, metadata: ArgumentMetadata): T {
    const obj = plainToClass(metadata.metatype, value) as T
    return obj
  }
}

@Injectable()
export class ParseWsRequestPipe<T extends ClassConstructor<any>> implements PipeTransform<any, T> {
  transform(value: any, metadata: ArgumentMetadata): T {
    const obj = plainToClass(metadata.metatype, value)
    const error = validateSync(obj, {
      whitelist: true
    })
    if (error.length > 0) {
      throw new WsException(new WsRequestValidationError(error))
    }
    return value
  }
}
