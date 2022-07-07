import { UserErrorCode } from "enums/errorCode.enum";
import { RequestStatus, RequestType } from "../../constants/request.constant";
import { Audit } from "../../domains/audit.domain";
import { Certificate } from "./certificate.domain";
import { User } from "./user.domain";

export class ConfirmRequestError extends Error {
  errorCode: UserErrorCode;
  constructor(msg: string, errorCode?: UserErrorCode) {
    super(msg);
    this.errorCode = errorCode;
  }
}

export class Request extends Audit {
  status: RequestStatus;

  type: RequestType;

  sender: User;

  certificates: Certificate[];

  note?: string;

  constructor(obj: Partial<Request>) {
    super(obj);
    this.status = obj?.status;
    this.type = obj?.type;
    this.sender = obj?.sender;
    this.certificates = obj?.certificates;
    this.note = obj?.note;
  }

  takeNote(note: string) {
    this.note = note;
  }

  isSenderBy(user: User): boolean {
    return this.sender.id === user.id;
  }

  isConfirmed(): boolean {
    return this.status === RequestStatus.CONFIRMED;
  }

  isRejected(): boolean {
    return this.status === RequestStatus.REJECTED;
  }

  confirm(newStatus: RequestStatus): ConfirmRequestError {
    const waitingCerts =
      this.certificates?.filter((cert) => cert.isWaiting()) ?? [];
    if (waitingCerts.length > 0)
      return new ConfirmRequestError(
        "Need to confirm all certificates before confirm request",
        UserErrorCode.NEED_CONFIRM_ALL_CERT
      );
    if (newStatus === RequestStatus.WAITING)
      return new ConfirmRequestError("New status is not valid");
    this.status = newStatus;
    return null;
  }

  isWaiting(): boolean {
    return this.status === RequestStatus.WAITING;
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
