import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";

@Injectable()
export class ParseRequestPipe<T extends ClassConstructor<any>> implements PipeTransform<any, T> {
  transform(value: any, metadata: ArgumentMetadata): T {
    const obj = plainToClass(metadata.metatype, value) as T
    return obj
  }
}
