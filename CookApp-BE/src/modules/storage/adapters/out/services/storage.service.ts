import { Inject, Injectable } from "@nestjs/common";
import _ = require("lodash");
import { PreSignedLinkResponse } from "modules/storage/dtos/preSignedLink.dto";
import { ConfigService } from "nestjs-config";
import { addFilePrefix, getFileExtension } from "utils";
import { IStorageProvider } from "./provider.service";

export interface IStorageService {
  getSignedLink(
    fileName: string,
    userId: string
  ): Promise<PreSignedLinkResponse>;
  setMetadata(objectName: string, meta: ObjectMetadata): Promise<any>;
  getSignedLinks(
    fileNames: string[],
    userId: string
  ): Promise<PreSignedLinkResponse[]>;
}

export type ObjectMetadata = {
  tags?: string[];
  used?: boolean;
};

@Injectable()
export class StorageService implements IStorageService {
  constructor(
    @Inject("IStorageProvider") private _provider: IStorageProvider,
    private _configService: ConfigService
  ) {}
  async setMetadata(objectName: string, meta: ObjectMetadata): Promise<any> {
    const bucket = await this._provider.getBucket();
    const response = bucket.file(objectName).setMetadata(meta);
    return response;
  }
  async getSignedLink(
    fileName: string,
    userId: string
  ): Promise<PreSignedLinkResponse> {
    const objectName = addFilePrefix(fileName, userId);
    const mimeType = `image/${getFileExtension(fileName)}`;
    const bucket = await this._provider.getBucket();
    const signedLink = await bucket.file(objectName).getSignedUrl({
      action: "write",
      expires:
        _.now() + this._configService.get("storage.presignedLinkExpiration"),
      contentType: mimeType,
    });
    return {
      signedLink: signedLink[0],
      objectName: objectName,
    };
  }

  async getSignedLinks(
    fileNames: string[],
    userId: string
  ): Promise<PreSignedLinkResponse[]> {
    const tasks: Promise<PreSignedLinkResponse>[] = [];
    fileNames.forEach((file) => tasks.push(this.getSignedLink(file, userId)));
    return Promise.all(tasks);
  }
}
