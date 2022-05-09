import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { PostType } from "enums/social.enum";
import { CreatePostRequest } from "modules/user/useCases/createPost/createPostRequest";

@Injectable()
export class ParseCreatePostRequestPipe
  implements PipeTransform<any, CreatePostRequest>
{
  transform(value: any, metadata: ArgumentMetadata): CreatePostRequest {
    const req = value as CreatePostRequest;
    switch (req.kind) {
      case PostType.FOOD_SHARE:
        if (!req.foodRefId)
          throw new BadRequestException(
            ResponseDTO.fail("Field foodRefId is required in FOOD_SHARE type")
          );
        break;
      case PostType.MOMENT:
        break;
      case PostType.RECOMMENDATION:
        if (!req.title)
          throw new BadRequestException(
            ResponseDTO.fail("Field title is required in RECOMMENDATION type")
          );
        if (!req.should)
          throw new BadRequestException(
            ResponseDTO.fail("Field should is required in RECOMMENDATION type")
          );
        if (!req.shouldNot)
          throw new BadRequestException(
            ResponseDTO.fail("Field shouldNot is required in RECOMMENDATION type")
          );
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Post type not valid"));
    }
    return req;
  }
}
