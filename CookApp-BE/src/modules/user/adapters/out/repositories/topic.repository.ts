import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Topic, User } from "domains/social/user.domain";
import { TopicEntity, UserTopicEntity } from "entities/social/topic.entity";
import { In, QueryRunner, Repository } from "typeorm";

export interface ITopicRepository {
  getTopics(queryOpt: PageOptionsDto): Promise<[Topic[], number]>;
  getTopicsByIds(ids: string[]): Promise<Topic[]>;
  setTransaction(tx: ITransaction): ITopicRepository;
  getInterestTopics(user: User): Promise<Topic[]>;
  insertUserTopic(user: User, topics: Topic[]): Promise<void>;
  deleteUserTopic(user: User, topics: Topic[]): Promise<void>;
}

@Injectable()
export class TopicRepository
  extends BaseRepository
  implements ITopicRepository
{
  constructor(
    @InjectRepository(TopicEntity)
    private _topicRepo: Repository<TopicEntity>,
    @InjectRepository(UserTopicEntity)
    private _useTopicRepo: Repository<UserTopicEntity>
  ) {
    super();
  }

  async deleteUserTopic(user: User, topics: Topic[]): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const topicIds = topics.map((topic) => topic.id);
      await this._useTopicRepo.createQueryBuilder("userTopic", queryRunner)
        .where("user_id = :userId", { userId: user.id })
        .andWhere("topic_id IN (:...topicIds)", { topicIds })
        .softDelete()
        .execute()
    }
  }

  async insertUserTopic(user: User, topics: Topic[]): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const entities = topics.map((topic) => new UserTopicEntity(user, topic));
      await queryRunner.manager.save<UserTopicEntity>(entities);
    }
  }

  async getInterestTopics(user: User): Promise<Topic[]> {
    const entities = await this._useTopicRepo.find({
      relations: ["topic"],
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return entities.map((item) => item.toDomain());
  }

  async getTopicsByIds(ids: string[]): Promise<Topic[]> {
    const entities = await this._topicRepo.find({
      where: {
        id: In(ids),
      },
    });
    return entities.map((item) => item.toDomain());
  }

  async getTopics(queryOpt: PageOptionsDto): Promise<[Topic[], number]> {
    const [entities, total] = await this._topicRepo.findAndCount({
      skip: queryOpt.limit * queryOpt.offset,
      take: queryOpt.limit,
    });
    return [entities?.map((entity) => entity.toDomain()), total];
  }
}
