import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { IInteractiveRequest } from "base/dtos/interfaces/interactableRequest.interface";
import { ResponseDTO } from "base/dtos/response.dto";
import { isUUID } from "class-validator";
import { UserErrorCode } from "enums/errorCode.enum";
import { InteractiveTargetType } from "enums/social.enum";

@Injectable()
export class ParseInteractableRequestPipe<T extends IInteractiveRequest> implements PipeTransform<any, T> {
  transform(value: any, metadata: ArgumentMetadata): T {
    const obj = value as T
    switch (obj.targetType) {
      case InteractiveTargetType.POST:
      case InteractiveTargetType.RECIPE_STEP:
        if (!isUUID(obj.targetId)) {
          throw new BadRequestException(ResponseDTO.fail("Target ID not valid", UserErrorCode.INVALID_ID))
        }
        break;
      case InteractiveTargetType.POST_MEDIA:
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Target type not valid"))
    }
    return obj
  }
}
