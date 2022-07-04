import { AbstractEntity } from "../../base/entities/base.entity";
import { UserEntity } from "./user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "../../domains/audit.domain";
import { RequestStatus, RequestType } from "../../constants/request.constant";
import { Request } from "../../domains/social/request.domain";
import { CertificateEntity } from "./certificate.entity";

@Entity({ name: "requests" })
export class RequestEntity extends AbstractEntity {
  @Column({
    name: "status",
    type: "enum",
    enum: RequestStatus,
    nullable: false,
    default: RequestStatus.WAITING,
  })
  status: RequestStatus;

  @Column({
    name: "type",
    type: "enum",
    enum: RequestType,
    nullable: false,
    default: RequestType.REQUEST_TO_BE_NUTRITIONIST,
  })
  type: RequestType;

  @Column({ name: "sender_id" })
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "sender_id" })
  sender: UserEntity;

  @OneToMany(() => CertificateEntity, (cert) => cert.request)
  certificates: CertificateEntity[];

  toDomain(): Request {
    const audit = new Audit(this);
    return new Request({
      ...audit,
      status: this.status,
      type: this.type,
      sender: this.sender?.toDomain(),
      certificates: this.certificates?.map((cert) => cert.toDomain()),
    });
  }
}
