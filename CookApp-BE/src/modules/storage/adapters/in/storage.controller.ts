import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKListResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import {
  PreSignedLinkRequest,
  PreSignedLinkResponse,
} from "modules/storage/dtos/preSignedLink.dto";
import { IStorageService } from "../out/services/storage.service";

@Controller("storage")
@ApiBearerAuth()
@ApiTags("Storage")
export class StorageController {
  constructor(
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}

  @Post()
  @ApiFailResponseCustom()
  @ApiOKListResponseCustom(
    PreSignedLinkResponse,
    "items",
    "Get presigned links successfully"
  )
  async getPresignedLinks(@Body() body: PreSignedLinkRequest,@Req() req) : Promise<Result<PreSignedLinkResponse[]>>{
    const result = await this._storageService.getSignedLinks(body.fileNames, req.user.id)
    return Result.okList(result, {
      messages: ["Get presigned links successfully"],
    });
    // return Result.okList(body.fileNames.map(file => getFileExtension(file)))
  }
}
