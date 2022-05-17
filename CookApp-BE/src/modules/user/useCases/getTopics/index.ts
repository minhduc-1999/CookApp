import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";
import { ITopicRepository } from "modules/user/adapters/out/repositories/topic.repository";
import { GetTopicsRequest } from "./getTopicsRequest";
import { GetTopicsResponse } from "./getTopicsResponse";

export class GetTopicsQuery extends BaseQuery {
  req: GetTopicsRequest;
  constructor(user: User, req: GetTopicsRequest) {
    super(user);
    this.req = req;
  }
}

@QueryHandler(GetTopicsQuery)
export class GetTopicsQueryHandler implements IQueryHandler<GetTopicsQuery> {
  constructor(
    @Inject("ITopicRepository")
    private _topicRepo: ITopicRepository
  ) {}
  async execute(query: GetTopicsQuery): Promise<GetTopicsResponse> {
    const { req } = query;
    const [topics, total] = await this._topicRepo.getTopics(req);

    let meta: PageMetadata;
    if (topics.length > 0) {
      meta = new PageMetadata(req.offset, req.limit, total);
    }
    return new GetTopicsResponse(topics, meta);
  }
}
