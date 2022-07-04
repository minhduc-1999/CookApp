import { AbstractEntity } from "../../base/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "../../domains/audit.domain";
import { Certificate } from "../../domains/social/certificate.domain";
import { Image } from "../../domains/social/media.domain";
import { RequestEntity } from "./request.entity";

@Entity({ name: "certificates" })
export class CertificateEntity extends AbstractEntity {
  @Column({ name: "content", nullable: false })
  title: string;

  @Column({ name: "issue_at", nullable: false })
  issueAt: Date;

  @Column({ name: "expire_at" })
  expireAt: Date;

  @Column({ name: "issue_by", nullable: false })
  issueBy: string;

  @Column({ name: "image", nullable: false })
  image: string;

  @Column({ name: "number", nullable: false, unique: true })
  number: string;

  @ManyToOne(() => RequestEntity, { nullable: false })
  @JoinColumn({ name: "request_id" })
  request: RequestEntity;

  constructor(obj: Certificate) {
    super(obj);
    this.title = obj?.title;
    this.issueAt = obj?.issueAt;
    this.issueBy = obj?.issueBy;
    this.image = obj?.image?.key;
    this.number = obj?.number;
  }

  toDomain(): Certificate {
    const audit = new Audit(this);
    return new Certificate({
      ...audit,
      title: this.title,
      issueBy: this.issueBy,
      issueAt: this.issueAt,
      expireAt: this.expireAt,
      image: this.image && new Image({ key: this.image }),
      number: this.number,
    });
  }
}
