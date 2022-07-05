import { Inject, Injectable } from "@nestjs/common";
import { Certificate } from "domains/social/certificate.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";

export interface ICertificateService {
  fulfillData(certs: Certificate[]): Promise<Certificate[]>;
}

@Injectable()
export class CertificateService implements ICertificateService {
  constructor(
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}

  async fulfillData(certs: Certificate[]): Promise<Certificate[]> {
    if (!certs || certs.length === 0) return [];

    for (let cert of certs) {
      if (cert.owner) {
        [cert.owner.avatar] = await this._storageService.getDownloadUrls([
          cert.owner.avatar,
        ]);
      }
      [cert.image] = await this._storageService.getDownloadUrls([cert.image]);
    }
    return certs;
  }
}
