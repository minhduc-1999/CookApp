import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseRepository } from "base/repository.base";
import { RequestStatus } from "constants/request.constant";
import { Request } from "domains/social/request.domain";
import { User } from "domains/social/user.domain";
import { RequestEntity } from "entities/social/request.entity";
import { Repository } from "typeorm";

export interface IRequestResitory {
  createRequest(request: Request): Promise<Request>;
  setTransaction(tx: ITransaction): IRequestResitory;
  getRequests(user: User, statuses: RequestStatus[]): Promise<Request[]>;
}

@Injectable()
export class RequestRepository
  extends BaseRepository
  implements IRequestResitory
{
  constructor(
    @InjectRepository(RequestEntity)
    private _requestRepo: Repository<RequestEntity>
  ) {
    super();
  }

  async getRequests(user: User, statuses: RequestStatus[]): Promise<Request[]> {
    let query = this._requestRepo
      .createQueryBuilder("request")
      .andWhere("request.senderId = :senderId", { senderId: user.id });

    if (statuses?.length > 0) {
      query = query.andWhere("request.status IN (:...statuses)", { statuses });
    }

    const entities = await query.getMany();
    return entities?.map((entity) => entity.toDomain());
  }

  async createRequest(request: Request): Promise<Request> {
    const entity = new RequestEntity(request);
    const saved = await this._requestRepo.save(entity);
    return saved?.toDomain();
  }
}
