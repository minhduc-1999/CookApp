import { Inject, Injectable, Logger } from "@nestjs/common";
import { MediaType } from "enums/mediaType.enum";
import _ = require("lodash");
import { PreSignedLinkResponse } from "modules/share/useCases/getUploadPresignedLink/presignedLinkResponse";
import { ConfigService } from "nestjs-config";
import {
  addFilePrefix,
  getMimeType,
  getNameFromPath,
} from "utils";
import { IStorageProvider } from "./provider.service";

export interface IStorageService {
  getUploadSignedLink(fileName: string): Promise<PreSignedLinkResponse>;
  setMetadata(objectName: string, meta: ObjectMetadata): Promise<any>;
  getUploadSignedLinks(
    fileNames: string[],
    userId: string
  ): Promise<PreSignedLinkResponse[]>;
  makePublic(objectNames: string[], mediaType: MediaType): Promise<string[]>;
  getDownloadUrls(objectNames: string[]): Promise<string[]>;
  replaceFiles(
    oldObjects: string[],
    newObjects: string[],
    mediaType: MediaType
  ): Promise<string[]>;
  deleteFiles(urls: string[]): Promise<string[]>;
}

export type ObjectMetadata = {
  tags?: string[];
  used?: boolean;
};

@Injectable()
export class FireBaseService implements IStorageService {
  private logger: Logger = new Logger(FireBaseService.name);

  private readonly storageTree = {
    postImages: "images/posts/",
    avatars: "images/avatars/",
    temp: "temp/",
  };

  constructor(
    @Inject("IStorageProvider") private _provider: IStorageProvider,
    private _configService: ConfigService
  ) { }
  async deleteFiles(objectKeys: string[]): Promise<string[]> {
    const deleteTasks: Promise<string>[] = [];
    const bucket = await this._provider.getBucket();
    for (let objectKey of objectKeys) {
      const file = bucket.file(objectKey);
      deleteTasks.push(
        file
          .delete({ ignoreNotFound: true })
          .then((res) => {
            if (res[0].statusCode === 204) return objectKey;
            else return "";
          })
          .catch((err) => {
            this.logger.error(err);
            return "";
          })
      );
    }
    return Promise.all(deleteTasks).then((objs) => {
      return objs.filter((objName) => {
        return objName !== "";
      });
    });
  }

  async replaceFiles(
    oldObjects: string[],
    newObjects: string[],
    mediaType: MediaType
  ): Promise<string[]> {
    const bucket = await this._provider.getBucket();
    let basePath: string;
    switch (mediaType) {
      case MediaType.POST_IMAGE:
        basePath = this.storageTree.postImages;
        break;
      case MediaType.AVATAR:
        basePath = this.storageTree.avatars;
        break;
      default:
        break;
    }
    const moveTasks: Promise<string>[] = [];
    oldObjects.forEach(async (oldObj) => {
      if (!oldObj) return;
      const oldFile = bucket.file(oldObj);
      oldFile
        .delete({ ignoreNotFound: true })
        .catch((err) => this.logger.error(err));
    });
    for (let newObj of newObjects) {
      const newFile = bucket.file(newObj);
      if ((await newFile.exists())[0]) {
        moveTasks.push(
          newFile
            .move(basePath + getNameFromPath(newObj))
            .then((movedFile) => {
              movedFile[0].makePublic().catch((err: Error) => this.logger.error(err));
              return movedFile[0].name;
            })
            .catch((err) => {
              this.logger.error(err);
              return "";
            })
        );
      }
    }
    return Promise.all(moveTasks).then((objectNames) => {
      return objectNames.filter((objName) => {
        return objName !== "";
      });
    });
  }

  async getDownloadUrls(objectNames: string[]): Promise<string[]> {
    if (!objectNames) return []
    return objectNames.map(
      (objName) => this._configService.get("storage.publicUrl") + objName
    );
  }

  async makePublic(
    objectKeys: string[],
    mediaType: MediaType
  ): Promise<string[]> {
    if (!objectKeys || objectKeys.length === 0) return []
    const bucket = await this._provider.getBucket();
    const tasks = [];
    const result: string[] = []
    for (const name of objectKeys) {
      const file = bucket.file(name);
      const fileExited = (await file.exists())[0];
      if (fileExited) {
        let basePath = "";
        switch (mediaType) {
          case MediaType.POST_IMAGE:
            basePath = this.storageTree.postImages;
            break;
          case MediaType.AVATAR:
            basePath = this.storageTree.avatars;
            break;
          default:
            break;
        }
        tasks.push(
          file
            .move(basePath + getNameFromPath(name))
            .then((movedFile) => {
              movedFile[0].makePublic().catch((err: unknown) => this.logger.error(err));
              result.push(movedFile[0].name)
            })
            .catch((err) => {
              this.logger.error(err);
            })
        );
      }
    }
    return Promise.all(tasks).then(() => {
      return result
    }
    );
  }

  async setMetadata(objectName: string, meta: ObjectMetadata): Promise<any> {
    const bucket = await this._provider.getBucket();
    const response = bucket.file(objectName).setMetadata(meta);
    return response;
  }

  async getUploadSignedLink(
    objectName: string
  ): Promise<PreSignedLinkResponse> {
    const mimeType = getMimeType(objectName);
    const bucket = await this._provider.getBucket();
    const expiredIn: number = this._configService.get(
      "storage.presignedLinkExpiration"
    );
    const signedLink = await bucket.file(objectName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + expiredIn * 60 * 1000,
      contentType: mimeType,
    });
    return {
      signedLink: signedLink[0],
      objectName: objectName,
    };
  }

  async getUploadSignedLinks(
    fileNames: string[],
    userId: string
  ): Promise<PreSignedLinkResponse[]> {
    const tasks: Promise<PreSignedLinkResponse>[] = [];
    fileNames.forEach((file) => {
      const objectName = this.storageTree.temp + addFilePrefix(file, userId);
      tasks.push(this.getUploadSignedLink(objectName));
    });

    return Promise.all(tasks);
  }

  async getDownLoadSignedLink(objectName: string): Promise<string> {
    const bucket = await this._provider.getBucket();
    const signedLink = await bucket.file(objectName).getSignedUrl({
      action: "read",
      expires:
        _.now() +
        this._configService.get("storage.presignedLinkExpiration") * 1000,
    });
    return signedLink[0];
  }
}
