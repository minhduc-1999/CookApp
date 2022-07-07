import { Inject, Injectable } from "@nestjs/common";
import { Request } from "domains/social/request.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ICertificateService } from "./certificate.service";

export interface IRequestService {
  fulfillData(certs: Request[]): Promise<Request[]>;
}

@Injectable()
export class RequestService implements IRequestService {
  constructor(
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("ICertificateService")
    private _certService: ICertificateService,
  ) {}

  async fulfillData(requests: Request[]): Promise<Request[]> {
    if (!requests || requests.length === 0) return [];

    for (let request of requests) {
      if (request.sender) {
        [request.sender.avatar] = await this._storageService.getDownloadUrls([
          request.sender.avatar,
        ]);
      }
      request.certificates = await this._certService.fulfillData(
        request.certificates
      );
    }
    return requests;
  }
}
