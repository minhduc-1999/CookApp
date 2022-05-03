import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Unit } from "domains/core/ingredient.domain";
import { UnitEntity } from "entities/core/ingredient.entity";
import { Repository } from "typeorm";

export interface IUnitRepository {
  getUnits(query: PageOptionsDto): Promise<[Unit[], number]>;
  setTransaction(tx: ITransaction): IUnitRepository;
}

@Injectable()
export class UnitRepository extends BaseRepository implements IUnitRepository {
  constructor(
    @InjectRepository(UnitEntity)
    private _unitRepo: Repository<UnitEntity>
  ) {
    super();
  }

  async getUnits(query: PageOptionsDto): Promise<[Unit[], number]> {
    const [unitEntities, total] = await this._unitRepo.findAndCount({
      skip: query.limit * query.offset,
      take: query.limit,
    });
    return [unitEntities?.map((entity) => entity.toDomain()), total];
  }
}
