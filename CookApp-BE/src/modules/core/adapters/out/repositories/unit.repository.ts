import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Unit } from "domains/core/ingredient.domain";
import { UnitEntity } from "entities/core/ingredient.entity";
import { QueryRunner, Repository } from "typeorm";

export interface IUnitRepository {
  getUnits(query: PageOptionsDto): Promise<[Unit[], number]>;
  setTransaction(tx: ITransaction): IUnitRepository;
  insertUnit(unit: Unit): Promise<Unit>;
}

@Injectable()
export class UnitRepository extends BaseRepository implements IUnitRepository {
  constructor(
    @InjectRepository(UnitEntity)
    private _unitRepo: Repository<UnitEntity>
  ) {
    super();
  }

  async insertUnit(unit: Unit): Promise<Unit> {
    if (!unit) return null;
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const unitEntity = new UnitEntity(unit);
      const savedUnit = await queryRunner.manager.save<UnitEntity>(unitEntity);
      return savedUnit?.toDomain();
    }
    return null;
  }

  async getUnits(query: PageOptionsDto): Promise<[Unit[], number]> {
    const [unitEntities, total] = await this._unitRepo.findAndCount({
      skip: query.limit * query.offset,
      take: query.limit,
    });
    return [unitEntities?.map((entity) => entity.toDomain()), total];
  }
}
