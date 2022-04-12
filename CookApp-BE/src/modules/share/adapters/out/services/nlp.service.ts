import { Injectable } from "@nestjs/common";
import * as Dialogflow from "@google-cloud/dialogflow"
import { ConfigService } from "nestjs-config";
import { inspectObj } from "utils";

export interface INlpServcie {
  detectIntent(query: string, sessionID?: string): Promise<void>
}

type NlpRequest = Dialogflow.protos.google.cloud.dialogflow.v2.IDetectIntentRequest

@Injectable()
export class DialogflowService implements INlpServcie {
  private client: Dialogflow.v2.SessionsClient
  constructor(private _configService: ConfigService) {
    const cert = this._configService.get("storage.credentialJson")
    this.client = new Dialogflow.SessionsClient({
      credentials: cert
    })
  }

  async detectIntent(query: string, sessionID?: string): Promise<void> {
    if (!sessionID) {
      sessionID = '23-f123af14'
    }
    const projectID = this._configService.get("nlp.projectID")
    const langCode = this._configService.get("nlp.langCode")
    const sesstionPath = this.client.projectAgentSessionPath(
      projectID,
      sessionID
    )
    const req: NlpRequest = {
      session: sesstionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: langCode
        }
      }
    }

    const response = await this.client.detectIntent(req)
    inspectObj(response)
  }
}
