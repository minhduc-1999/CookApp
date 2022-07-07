import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { RequestStatus } from "constants/request.constant";
import { Request } from "domains/social/request.domain";
import { User } from "domains/social/user.domain";
import { RequestEntity } from "entities/social/request.entity";
import { GetAllRequestsRequestDTO } from "modules/user/useCases/getAllRequests/getAllRequests.request";
import { QueryRunner, Repository } from "typeorm";

export interface IRequestRepository {
  createRequest(request: Request): Promise<Request>;
  setTransaction(tx: ITransaction): IRequestRepository;
  getRequests(user: User, statuses: RequestStatus[]): Promise<Request[]>;
  getAllRequest(
    queryOpt: GetAllRequestsRequestDTO
  ): Promise<[Request[], number]>;
  getRequestsPaggination(
    user: User,
    queryOpt: PageOptionsDto
  ): Promise<[Request[], number]>;
  getById(requestId: string): Promise<Request>;
  updateRequest(request: Request): Promise<void>;
}

@Injectable()
export class RequestRepository
  extends BaseRepository
  implements IRequestRepository
{
  constructor(
    @InjectRepository(RequestEntity)
    private _requestRepo: Repository<RequestEntity>
  ) {
    super();
  }

  async updateRequest(request: Request): Promise<void> {
    const entity = new RequestEntity(request);
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.save<RequestEntity>(entity);
      return;
    }
    await this._requestRepo.save(entity);
  }

  async getById(requestId: string): Promise<Request> {
    const entity = await this._requestRepo.findOne({
      where: {
        id: requestId,
      },
      relations: ["certificates", "sender"],
    });
    return entity?.toDomain();
  }

  async getRequestsPaggination(
    user: User,
    queryOpt: PageOptionsDto
  ): Promise<[Request[], number]> {
    let query = this._requestRepo
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.certificates", "certs")
      .where("request.senderId = :senderId", { senderId: user.id })
      .orderBy("request.createdAt", "DESC")
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit);
    const [entities, total] = await query.getManyAndCount();
    return [entities?.map((entity) => entity.toDomain()), total];
  }

  async getRequests(user: User, statuses: RequestStatus[]): Promise<Request[]> {
    let query = this._requestRepo
      .createQueryBuilder("request")
      .where("request.senderId = :senderId", { senderId: user.id });

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

  async getAllRequest(
    queryOpt: GetAllRequestsRequestDTO
  ): Promise<[Request[], number]> {
    let query = this._requestRepo
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.certificates", "certs")
      .leftJoinAndSelect("request.sender", "sender");

    if (queryOpt.status) {
      query = query.where("request.status = :status", {
        status: queryOpt.status,
      });
    }

    query = query
      .orderBy("request.createdAt", "DESC")
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit);

    const [entities, total] = await query.getManyAndCount();
    return [entities?.map((entity) => entity.toDomain()), total];
  }
}
