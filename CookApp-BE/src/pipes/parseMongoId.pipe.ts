import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { isUUID } from "class-validator";
import { ErrorCode } from "enums/errorCode.enum";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {
  transform(value: any, metadata: ArgumentMetadata): string {
    const validObjectId = isUUID(value);
    if (!validObjectId) throw new BadRequestException(ResponseDTO.fail("Invalid ID", ErrorCode.INVALID_ID));
    return value;
  }
}
