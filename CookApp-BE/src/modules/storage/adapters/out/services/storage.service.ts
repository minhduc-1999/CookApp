import { Inject, Injectable } from "@nestjs/common";
import { IsEqualCustomizer } from "lodash";
import { IStorageProvider } from "./provider.service";

export interface IStorageService {
    uploadFile(data: Buffer, fileKey: string) : Promise<any>
}

@Injectable()
export class StorageService implements IStorageService {
  constructor(
    @Inject("IStorageProvider") private _provider: IStorageProvider
  ) {}

  async uploadFile(data: Buffer, fileKey: string): Promise<any> {
  }
}