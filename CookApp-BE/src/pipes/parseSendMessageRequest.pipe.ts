import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { MessageContentType } from "enums/social.enum";
import { SendMessageRequest } from "modules/communication/usecases/sendMessages/sendMessageRequest";

@Injectable()
export class ParseSendMessageRequestPipe
  implements PipeTransform<any, SendMessageRequest>
{
  transform(value: any, metadata: ArgumentMetadata): SendMessageRequest {
    const req = value as SendMessageRequest;
    switch (req.type) {
      case MessageContentType.IMAGE:
        if (!req.imageContent)
          throw new BadRequestException(
            ResponseDTO.fail("Field imageContent is required if type is IMAGE")
          );
        break;
      case MessageContentType.TEXT:
        if (!req.message)
          throw new BadRequestException(
            ResponseDTO.fail("Field message is required if type is TEXT")
          );
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Message content type not valid"));
    }
    return req;
  }
}
