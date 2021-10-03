import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from "@nestjs/common";
import { Result } from "base/result.base";
import { ClassTransformOptions, plainToClass } from "class-transformer";
import { Document } from "mongoose";

function MongooseClassSerializerInterceptor(
  classToIntercept: Type
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
       if (document instanceof Result) {
         const data = document.getData();
         if (data instanceof Document) {
           document.setData(plainToClass(classToIntercept, data.toJSON()));
         }
         return document.getResponseDTO();
       }
      
      if (!(document instanceof Document)) {
        return document;
      }

      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[]
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}

export default MongooseClassSerializerInterceptor;
