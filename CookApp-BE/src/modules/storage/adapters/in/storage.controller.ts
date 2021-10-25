import { Controller, Inject, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IStorageService } from "../out/services/storage.service";

@Controller("storage")
@ApiBearerAuth()
@ApiTags('Storage')
export class StorageController {
  constructor(
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  @Post()
  async uploadImage() {
      const a = await this._storageService.uploadFile(null, 'file')
      return a;
  }
}
