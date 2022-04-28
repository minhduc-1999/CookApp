import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Food } from "domains/core/food.domain";
import { FoodVote } from "domains/core/foodVote.domain";
import { User } from "domains/social/user.domain";
import { FoodVoteEntity } from "entities/core/foodVote.entity";
import { QueryRunner, Repository } from "typeorm";

export interface IFoodVoteRepository {
  setTransaction(tx: ITransaction): IFoodVoteRepository;
  insertVote(vote: FoodVote): Promise<FoodVote>;
  findVote(user: User, food: Food): Promise<FoodVote>;
  getVotes(food: Food, query: PageOptionsDto): Promise<[FoodVote[], number]>;
  updateVote(
    vote: FoodVote,
    partialData: Partial<FoodVote>
  ): Promise<void>;
}

@Injectable()
export class FoodVoteRepository
  extends BaseRepository
  implements IFoodVoteRepository
{
  constructor(
    @InjectRepository(FoodVoteEntity)
    private _foodVoteRepo: Repository<FoodVoteEntity>
  ) {
    super();
  }
  async updateVote(
    vote: FoodVote,
    partialData: Partial<FoodVote>
  ): Promise<void> {
    if (!vote) return;
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.update<FoodVoteEntity>(
        FoodVoteEntity,
        {
          id: vote.id,
        },
        FoodVoteEntity.getUpdatePayload(partialData)
      );
    }
  }

  async getVotes(
    food: Food,
    query: PageOptionsDto
  ): Promise<[FoodVote[], number]> {
    const [voteEntities, total] = await this._foodVoteRepo.findAndCount({
      relations: ["author"],
      where: {
        food: {
          id: food.id,
        },
      },
      skip: query.limit * query.offset,
      take: query.limit,
    });
    return [voteEntities?.map((entity) => entity.toDomain()), total];
  }

  async findVote(user: User, food: Food): Promise<FoodVote> {
    const vote = await this._foodVoteRepo.findOne({
      where: {
        author: {
          id: user.id,
        },
        food: {
          id: food.id,
        },
      },
    });
    return vote?.toDomain();
  }

  async insertVote(vote: FoodVote): Promise<FoodVote> {
    if (!vote) return null;
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const voteEntity = new FoodVoteEntity(vote);
      const result = await queryRunner.manager.save<FoodVoteEntity>(voteEntity);
      return result.toDomain();
    }
    return null;
  }
}
