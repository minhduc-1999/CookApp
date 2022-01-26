import { Body, Controller, Post } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKListResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { UserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetUploadPresignedLinkQuery } from "modules/share/useCases/getUploadPresignedLink";
import { PreSignedLinkRequest } from "modules/share/useCases/getUploadPresignedLink/presignedLinkRequest";
import { PreSignedLinkResponse } from "modules/share/useCases/getUploadPresignedLink/presignedLinkResponse";

@Controller("storage")
@ApiBearerAuth()
@ApiTags("Storage")
export class StorageController {
  constructor(private _queryBus: QueryBus) {}

  @Post("uploadSignedUrl")
  @ApiFailResponseCustom()
  @ApiOKListResponseCustom(
    PreSignedLinkResponse,
    "items",
    "Get presigned links successfully"
  )
  async getPresignedLinks(
    @Body() body: PreSignedLinkRequest,
    @UserReq() user: User
  ): Promise<Result<PreSignedLinkResponse[]>> {
    const query = new GetUploadPresignedLinkQuery(body, user.id);
    const result = await this._queryBus.execute(query);
    return Result.okList(result, {
      messages: ["Get presigned links successfully"],
    });
  }
}
