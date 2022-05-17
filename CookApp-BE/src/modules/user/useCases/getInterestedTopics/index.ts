import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { User } from "domains/social/user.domain";
import { ITopicRepository } from "modules/user/adapters/out/repositories/topic.repository";
import { GetInterestedTopicsResponse } from "./getInterestedTopicsResponse";

export class GetInterestedTopicsQuery extends BaseQuery {
  constructor(user: User) {
    super(user);
  }
}

@QueryHandler(GetInterestedTopicsQuery)
export class GetInterestedTopicsQueryHandler
  implements IQueryHandler<GetInterestedTopicsQuery>
{
  constructor(
    @Inject("ITopicRepository")
    private _topicRepo: ITopicRepository
  ) {}
  async execute(
    query: GetInterestedTopicsQuery
  ): Promise<GetInterestedTopicsResponse> {
    const { user } = query;

    const topics = await this._topicRepo.getInterestTopics(user);

    return new GetInterestedTopicsResponse(topics);
  }
}
