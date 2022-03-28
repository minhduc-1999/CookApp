import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Reaction } from "domains/social/reaction.domain";
import { ReactionEntity } from "entities/social/reaction.entity";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { QueryRunner, Repository } from "typeorm";

@Injectable()
export class ReactionRepository extends BaseRepository implements IReactionRepository {
  constructor(
    @InjectRepository(ReactionEntity)
    private _reactionRepo: Repository<ReactionEntity>,
  ) {
    super()
  }
  async count(targetId: string): Promise<number> {
    const total = await this._reactionRepo
      .createQueryBuilder("reaction")
      .where("reaction.target_id = :targetId", { targetId })
      .getCount()
    return total
  }

  async create(reaction: Reaction): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.save<ReactionEntity>(new ReactionEntity(reaction))
    }
  }

  async delete(reaction: Reaction): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.softDelete(ReactionEntity, reaction.id)
    }
  }

  async findById(userId: string, targetId: string): Promise<Reaction> {
    const entity = await this._reactionRepo
      .createQueryBuilder("reaction")
      .innerJoin("reaction.user", "user")
      .innerJoin("reaction.target", "target")
      .where("user.id = :userId", { userId })
      .andWhere("target.id = :targetId", { targetId })
      .select(["reaction"])
      .getOne()
    return entity?.toDomain()
  }

  async findByIds(userId: string, targetIds: string[]): Promise<Reaction[]> {
    const entities = await this._reactionRepo
      .createQueryBuilder("reaction")
      .innerJoin("reaction.user", "user")
      .innerJoin("reaction.target", "target")
      .where("user.id = :userId", { userId })
      .andWhere("target.id IN (:...targetIds)", { targetIds })
      .select(["reaction"])
      .getMany()
    return entities?.map(entity => entity.toDomain())
  }
}
