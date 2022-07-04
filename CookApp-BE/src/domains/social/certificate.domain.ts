import { Audit } from "../../domains/audit.domain";
import { Image } from "./media.domain";

export class Certificate extends Audit {
  issueAt: Date;

  issueBy: string;

  title: string;

  expireAt: Date;

  image: Image

  constructor(obj: Partial<Certificate>) {
    super(obj);
    this.issueAt = obj?.issueAt;
    this.issueBy = obj?.issueBy;
    this.title = obj?.title;
    this.expireAt = obj?.expireAt;
    this.image = obj?.image;
  }
}
