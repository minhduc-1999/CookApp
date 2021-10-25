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
    constructor(private _configService: ConfigService) {}
    async getBucket(): Promise<Bucket> {
        const firebaseCredentialPath = this._configService.get(
          "storage.credentialPath"
        );
        console.log(firebaseCredentialPath);
        console.log(this._configService.get("storage.storageBucket"));

        initializeApp({
          credential: firebaseCredentialPath
            ? cert(firebaseCredentialPath)
            : applicationDefault(),
          storageBucket: this._configService.get("storage.storageBucket"),
        });
    return getStorage().bucket();
    }

}