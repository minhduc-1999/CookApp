import { Injectable } from "@nestjs/common";
import { initializeApp } from "firebase-admin";
import { applicationDefault, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { ConfigService } from "nestjs-config";

export interface INotiRepository {
  push(): Promise<void>;
}

@Injectable()
export class NotiRepository implements INotiRepository {
  private firestore: FirebaseFirestore.Firestore;
  constructor(private _configService: ConfigService) {
    const firebaseCredentialPath = this._configService.get(
      "storage.credentialPath"
    );

    if (getApps().length === 0) {
      initializeApp({
        credential: firebaseCredentialPath
          ? cert(firebaseCredentialPath)
          : applicationDefault(),
      });
    }
    this.firestore = getFirestore();
  }
  async push(): Promise<void> {
    console.log("noti repo");
    const doc = this.firestore.doc(
      "/modules/notification/users/GzG7ZCO9seJjCQnE6gzg/badge/Jw1uwodhWq0EeHU5KjI7"
    );
    const result = await doc.get();
    console.log(result.data());
    return;
  }
}
