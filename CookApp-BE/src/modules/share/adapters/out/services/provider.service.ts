import { Injectable } from "@nestjs/common";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { ConfigService } from "nestjs-config";
import { Bucket } from "@google-cloud/storage";
import { getFirestore } from "firebase-admin/firestore";


export interface IStorageProvider {
  getBucket(): Bucket;
  getFirestore(): FirebaseFirestore.Firestore
}

@Injectable()
export class FirebaseStorageProvider implements IStorageProvider {
  constructor(private _configService: ConfigService) {
    const firebaseCert = this._configService.get(
      "storage.credentialJson"
    );

    initializeApp({
      credential: firebaseCert
        ? cert(firebaseCert)
        : applicationDefault(),
      storageBucket: this._configService.get("storage.storageBucket"),
    });
  }
  getFirestore(): FirebaseFirestore.Firestore {
    return getFirestore()
  }
  getBucket(): Bucket {
    return getStorage().bucket();
  }
}
