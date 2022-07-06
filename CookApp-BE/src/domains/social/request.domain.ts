import { RequestStatus, RequestType } from "../../constants/request.constant";
import { Audit } from "../../domains/audit.domain";
import { Certificate } from "./certificate.domain";
import { User } from "./user.domain";

export class Request extends Audit {
  status: RequestStatus;

  type: RequestType;

  sender: User;

  certificates: Certificate[];

  note?: string

  constructor(obj: Partial<Request>) {
    super(obj);
    this.status = obj?.status;
    this.type = obj?.type;
    this.sender = obj?.sender;
    this.certificates = obj?.certificates;
    this.note = obj?.note
  }

  takeNote(note: string) {
    this.note = note
  }

  static createRequest(sender: User, certs: Certificate[]): Request {
    const request = new Request({
      sender,
      certificates: certs,
    });
    request.status = RequestStatus.WAITING;
    return request;
  }
}
