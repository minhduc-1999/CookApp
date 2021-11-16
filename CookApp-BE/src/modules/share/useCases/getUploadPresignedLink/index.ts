import { Inject } from "@nestjs/common";
import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { PreSignedLinkRequest } from "./presignedLinkRequest";
import { PreSignedLinkResponse } from "./presignedLinkResponse";
export class GetUploadPresignedLinkQuery implements IQuery {
  presignedLinkReq: PreSignedLinkRequest;
  userId: string;
  constructor(presignedLinkReq: PreSignedLinkRequest, userId: string) {
    this.presignedLinkReq = presignedLinkReq;
    this.userId = userId;
  }
}
@QueryHandler(GetUploadPresignedLinkQuery)
export class GetUploadPresignedLinkQueryHandler
  implements IQueryHandler<GetUploadPresignedLinkQuery> {
  constructor(
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async execute(
    command: GetUploadPresignedLinkQuery
  ): Promise<PreSignedLinkResponse[]> {
    return this._storageService.getUploadSignedLinks(
      command.presignedLinkReq.fileNames,
      command.userId
    );
  }
}
