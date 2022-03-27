import { Inject, Injectable, Logger } from "@nestjs/common";
import _ = require("lodash");
import { PreSignedLinkResponse } from "modules/share/useCases/getUploadPresignedLink/presignedLinkResponse";
import { ConfigService } from "nestjs-config";
import { Bucket } from "@google-cloud/storage";
import {
  addFilePrefix,
  getMimeType,
  getNameFromPath,
} from "utils";
import { IStorageProvider } from "./provider.service";
import { CommentMedia } from "domains/social/media.domain";
import { MediaType } from "enums/social.enum";

export interface IStorageService {
  getUploadSignedLink(fileName: string): Promise<PreSignedLinkResponse>;
  setMetadata(objectName: string, meta: ObjectMetadata): Promise<any>;
  getUploadSignedLinks(
    fileNames: string[],
    userId: string
  ): Promise<PreSignedLinkResponse[]>;
  makePublic(objectNames: string[], mediaType: MediaType): Promise<string[]>;
  getDownloadUrls(mediaArr: CommentMedia[]): Promise<CommentMedia[]>;
  replaceFiles(
    oldMediaArr: CommentMedia[],
    newKeys: string[],
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
    image: "images/",
    video: "videos/",
    audio: "audios/",
    temp: "temp/",
  };
  private bucket: Bucket

  constructor(
    @Inject("IStorageProvider") private _provider: IStorageProvider,
    private _configService: ConfigService
  ) {
    this.bucket = this._provider.getBucket()
  }
  async deleteFiles(objectKeys: string[]): Promise<string[]> {
    const deleteTasks: Promise<string>[] = [];
    for (let objectKey of objectKeys) {
      const file = this.bucket.file(objectKey);
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
    oldMediaArr: CommentMedia[],
    newObjects: string[],
    mediaType: MediaType
  ): Promise<string[]> {
    let basePath: string;
    switch (mediaType) {
      case MediaType.IMAGE:
        basePath = this.storageTree.image;
        break;
      case MediaType.VIDEO:
        basePath = this.storageTree.video;
        break;
      case MediaType.AUDIO:
        basePath = this.storageTree.audio;
        break;
      default:
        break;
    }
    const moveTasks: Promise<string>[] = [];
    // oldMediaArr.forEach(async (oldMedia) => {
    //   if (!oldMedia) return;
    //   const oldFile = this.bucket.file(oldMedia.key);
    //   oldFile
    //     .delete({ ignoreNotFound: true })
    //     .catch((err) => this.logger.error(err));
    // });
    for (let newObj of newObjects) {
      const newFile = this.bucket.file(newObj);
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

  async getDownloadUrls(mediaArr: CommentMedia[]): Promise<CommentMedia[]> {
    if (!mediaArr) return []
    return mediaArr.map(
      (media) => {
        if (!media.key) return null
        media.url = this._configService.get("storage.publicUrl") + media.key
        return media
      }
    );
  }

  async makePublic(
    objectKeys: string[],
    mediaType: MediaType
  ): Promise<string[]> {
    if (!objectKeys || objectKeys.length === 0) return []
    const tasks = [];
    const result: string[] = []
    for (const name of objectKeys) {
      const file = this.bucket.file(name);
      const fileExited = (await file.exists())[0];
      if (fileExited) {
        let basePath = "";
        switch (mediaType) {
          case MediaType.IMAGE:
            basePath = this.storageTree.image;
            break;
          case MediaType.VIDEO:
            basePath = this.storageTree.video;
            break;
          case MediaType.AUDIO:
            basePath = this.storageTree.audio;
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
    const response = this.bucket.file(objectName).setMetadata(meta);
    return response;
  }

  async getUploadSignedLink(
    objectName: string
  ): Promise<PreSignedLinkResponse> {
    const mimeType = getMimeType(objectName);
    const expiredIn: number = this._configService.get(
      "storage.presignedLinkExpiration"
    );
    const signedLink = await this.bucket.file(objectName).getSignedUrl({
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
    const signedLink = await this.bucket.file(objectName).getSignedUrl({
      action: "read",
      expires:
        _.now() +
        this._configService.get("storage.presignedLinkExpiration") * 1000,
    });
    return signedLink[0];
  }
}
