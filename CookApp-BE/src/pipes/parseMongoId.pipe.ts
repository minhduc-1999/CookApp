import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { Types } from "mongoose";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {
  transform(value: any, metadata: ArgumentMetadata): string {
    const validObjectId = Types.ObjectId.isValid(value);
    if (!validObjectId) throw new BadRequestException(ResponseDTO.fail("Invalid ID", ErrorCode.INVALID_ID));
    return value;
  }
}
