import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Topic } from "domains/social/user.domain";
import { TopicEntity } from "entities/social/topic.entity";
import { Repository } from "typeorm";

export interface ITopicRepository {
  getTopics(queryOpt: PageOptionsDto): Promise<[Topic[], number]>;
  setTransaction(tx: ITransaction): ITopicRepository;
}

@Injectable()
export class TopicRepository
  extends BaseRepository
  implements ITopicRepository
{
  constructor(
    @InjectRepository(TopicEntity)
    private _topicRepo: Repository<TopicEntity>
  ) {
    super();
  }
  async getTopics(queryOpt: PageOptionsDto): Promise<[Topic[], number]> {
    const [entities, total] = await this._topicRepo.findAndCount({
      skip: queryOpt.limit * queryOpt.offset,
      take: queryOpt.limit,
    });
    return [entities?.map((entity) => entity.toDomain()), total];
  }
}
