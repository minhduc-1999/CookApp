import { Inject, Injectable, Logger } from "@nestjs/common";
import _ = require("lodash");
import { PreSignedLinkResponse } from "modules/share/useCases/getUploadPresignedLink/presignedLinkResponse";
import { ConfigService } from "nestjs-config";
import { Bucket } from "@google-cloud/storage";
import { addFilePrefix, getMimeType, getNameFromPath } from "utils";
import { IStorageProvider } from "./provider.service";
import { Media } from "domains/social/media.domain";
import { MediaType } from "enums/social.enum";
import { isNil } from "lodash";

export interface IStorageService {
  getUploadSignedLink(fileName: string): Promise<PreSignedLinkResponse>;
  setMetadata(objectName: string, meta: ObjectMetadata): Promise<any>;
  getUploadSignedLinks(
    fileNames: string[],
    userId: string
  ): Promise<PreSignedLinkResponse[]>;
  makePublic(
    objectNames: string[],
    mediaType: MediaType,
    subPath:
      | "post"
      | "food"
      | "recipe-step"
      | "comment"
      | "album"
      | "avatar"
      | "topic"
  ): Promise<string[]>;
  getDownloadUrls(mediaArr: Media[]): Promise<Media[]>;
  deleteFiles(medias: Media[]): Promise<Media[]>;
}

export type ObjectMetadata = {
  tags?: string[];
  used?: boolean;
};

@Injectable()
export class FireBaseService implements IStorageService {
  private logger: Logger = new Logger(FireBaseService.name);

  private readonly _storageTreeRoot = {
    image: "images/",
    video: "videos/",
    audio: "audios/",
    temp: "temp/",
  };

  private readonly _subPath = {
    post: "posts/",
    food: "foods/covers/",
    "recipe-step": "foods/step_photos/",
    album: "albums/",
    comment: "comments/",
    avatar: "avatars/",
    topic: "topics/"
  }
  private bucket: Bucket;

  constructor(
    @Inject("IStorageProvider") private _provider: IStorageProvider,
    private _configService: ConfigService
  ) {
    this.bucket = this._provider.getBucket();
  }
  async deleteFiles(medias: Media[]): Promise<Media[]> {
    const deleteTasks: Promise<Media>[] = [];
    for (let media of medias) {
      const file = this.bucket.file(media.key);
      deleteTasks.push(
        file
          .delete({ ignoreNotFound: true })
          .then((res) => {
            if (res[0].statusCode === 204) 
              return media;
            else 
              return null;
          })
          .catch((err) => {
            this.logger.error(err);
            return null;
          })
      );
    }
    return Promise.all(deleteTasks).then((objs) => {
      return objs.filter((obj) => {
        return !isNil(obj);
      });
    });
  }

  async getDownloadUrls(mediaArr: Media[]): Promise<Media[]> {
    if (!mediaArr) return [];
    return mediaArr.map((media) => {
      if (!media.key) return null;
      media.url = this._configService.get("storage.publicUrl") + media.key;
      return media;
    });
  }

  async makePublic(
    objectKeys: string[],
    mediaType: MediaType,
    subPath:
      | "post"
      | "food"
      | "recipe-step"
      | "comment"
      | "album"
      | "avatar"
  ): Promise<string[]> {
    if (!objectKeys || objectKeys.length === 0) return [];
    const tasks = [];
    const result: string[] = [];
    for (const name of objectKeys) {
      const file = this.bucket.file(name);
      const [fileExited] = await file.exists();
      if (fileExited) {
        let basePath = "";
        switch (mediaType) {
          case MediaType.IMAGE:
            basePath = this._storageTreeRoot.image;
            break;
          case MediaType.VIDEO:
            basePath = this._storageTreeRoot.video;
            break;
          case MediaType.AUDIO:
            basePath = this._storageTreeRoot.audio;
            break;
          default:
            break;
        }
        if (subPath) basePath += this._subPath[subPath]
        tasks.push(
          file
            .move(basePath + getNameFromPath(name))
            .then((movedFile) => {
              movedFile[0]
                .makePublic()
                .catch((err: unknown) => this.logger.error(err));
              result.push(movedFile[0].name);
            })
            .catch((err) => {
              this.logger.error(err);
            })
        );
      }
    }
    return Promise.all(tasks).then(() => {
      return result;
    });
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
      const objectName = this._storageTreeRoot.temp + addFilePrefix(file, userId);
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
