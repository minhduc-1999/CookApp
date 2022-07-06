import { CertificateStatus } from "../../constants/certificate.constant";
import { Audit } from "../../domains/audit.domain";
import { Image } from "./media.domain";
import { User } from "./user.domain";

export class Certificate extends Audit {
  issueAt: Date;

  issueBy: string;

  title: string;

  expireAt: Date;

  image: Image;

  number: string;

  status: CertificateStatus;

  owner: User;

  note: string;

  constructor(obj: Partial<Certificate>) {
    super(obj);
    this.issueAt = obj?.issueAt;
    this.issueBy = obj?.issueBy;
    this.title = obj?.title;
    this.expireAt = obj?.expireAt;
    this.image = obj?.image;
    this.number = obj?.number;
    this.status = obj?.status;
    this.owner = obj?.owner;
    this.note = obj?.note;
  }

  takeNote(note: string): void {
    this.note = note;
  }

  isWaiting(): boolean {
    return this.status === CertificateStatus.WAITING;
  }

  isConfirmed(): boolean {
    return this.status === CertificateStatus.CONFIRMED;
  }

  isRejected(): boolean {
    return this.status === CertificateStatus.REJECTED;
  }

  confirm(newStatus: CertificateStatus): Error {
    if (newStatus === CertificateStatus.WAITING)
      return new Error("New status is not valid");
    this.status = newStatus;
    return null;
  }
}
