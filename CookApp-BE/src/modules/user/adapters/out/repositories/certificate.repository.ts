import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CertificateStatus } from "constants/certificate.constant";
import { Certificate } from "domains/social/certificate.domain";
import { User } from "domains/social/user.domain";
import { CertificateEntity } from "entities/social/certificate.entity";
import { GetCertsRequest } from "modules/user/useCases/getCertificates/getCertificates.request";
import { Repository } from "typeorm";

export interface ICertificateRepository {
  getByNumbers(
    numbers: string[],
    user: User,
    statuses?: CertificateStatus[]
  ): Promise<Certificate[]>;
  getByUser(
    user: User,
    queryOpt: GetCertsRequest
  ): Promise<[Certificate[], number]>;
}

@Injectable()
export class CertificateRepository implements ICertificateRepository {
  constructor(
    @InjectRepository(CertificateEntity)
    private _certRepo: Repository<CertificateEntity>
  ) {}
  async getByUser(
    user: User,
    queryOpt: GetCertsRequest
  ): Promise<[Certificate[], number]> {
    let query = this._certRepo
      .createQueryBuilder("cert")
      .where("cert.userId = :userId", { userId: user.id });

    if (queryOpt.status) {
      query = query.andWhere("cert.status = :status", {
        status: queryOpt.status,
      });
    }
    query = query.skip(queryOpt.limit * queryOpt.offset).take(queryOpt.limit);

    const [entities, total] = await query.getManyAndCount();
    return [entities?.map((entity) => entity.toDomain()), total];
  }

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
