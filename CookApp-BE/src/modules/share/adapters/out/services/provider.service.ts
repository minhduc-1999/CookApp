import { Injectable } from "@nestjs/common";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { ConfigService } from "nestjs-config";
import { Bucket } from "@google-cloud/storage";


export interface IStorageProvider {
  getBucket(): Promise<Bucket>;
}

@Injectable()
export class FirebaseStorageProvider implements IStorageProvider {
    constructor(private _configService: ConfigService) {
      const firebaseCredentialPath = this._configService.get(
        "storage.credentialPath"
      );

      initializeApp({
        credential: firebaseCredentialPath
          ? cert(firebaseCredentialPath)
          : applicationDefault(),
        storageBucket: this._configService.get("storage.storageBucket"),
      });
    }
    async getBucket(): Promise<Bucket> {
      return getStorage().bucket();
    }

}