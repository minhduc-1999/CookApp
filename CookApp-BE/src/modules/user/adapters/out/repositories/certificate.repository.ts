import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CertificateStatus } from "constants/certificate.constant";
import { Certificate } from "domains/social/certificate.domain";
import { User } from "domains/social/user.domain";
import { CertificateEntity } from "entities/social/certificate.entity";
import { Repository } from "typeorm";

export interface ICertificateRepository {
  getByNumbers(
    numbers: string[],
    user: User,
    statuses?: CertificateStatus[]
  ): Promise<Certificate[]>;
}

@Injectable()
export class CertificateRepository implements ICertificateRepository {
  constructor(
    @InjectRepository(CertificateEntity)
    private _certRepo: Repository<CertificateEntity>
  ) {}

  async getByNumbers(
    numbers: string[],
    user: User,
    statuses?: CertificateStatus[]
  ): Promise<Certificate[]> {
    let query = this._certRepo
      .createQueryBuilder("cert")
      .where("cert.userId = :userId", { userId: user.id })
      .andWhere("cert.number IN (:...numbers)", { numbers });

    if (statuses?.length > 0) {
      query = query.andWhere("cert.status IN (:...statuses)", { statuses });
    }
    const entities = await query.getMany();
    return entities?.map((entity) => entity.toDomain());
  }
}
