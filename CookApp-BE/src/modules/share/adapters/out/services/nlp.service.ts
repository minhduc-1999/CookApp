import { Injectable } from "@nestjs/common";
import * as Dialogflow from "@google-cloud/dialogflow"
import { ConfigService } from "nestjs-config";
import { v4 as uuidv4 } from 'uuid'

export interface INlpServcie {
  detectIntent(query: string, sessionID?: string): Promise<NlpResponse>
}

type NlpResponse = {
  allRequiredParamsPresent: boolean
  action: string
  parameters: {
    fields: any
  },
  fulfillmentText: string,
  endInteraction: boolean,
  sessionID: string
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

  async detectIntent(query: string, sessionID?: string): Promise<NlpResponse> {
    if (!sessionID) {
      sessionID = uuidv4()
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

    const [response] = await this.client.detectIntent(req)
    return {
      endInteraction: response.queryResult.intent.endInteraction,
      fulfillmentText: response.queryResult.fulfillmentText,
      action: response?.queryResult.action,
      allRequiredParamsPresent: response?.queryResult.allRequiredParamsPresent,
      parameters: {
        fields: response?.queryResult.parameters.fields
      },
      sessionID: sessionID
    }
  }
}
