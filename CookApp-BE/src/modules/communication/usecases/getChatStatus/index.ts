import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { User } from "domains/social/user.domain";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { GetChatStatusResponse } from "./getChatStatusResponse";

export class GetChatStatusQuery extends BaseQuery {
  constructor(user: User) {
    super(user);
  }
}

@QueryHandler(GetChatStatusQuery)
export class GetChatStatusQueryHandler
  implements IQueryHandler<GetChatStatusQuery>
{
  constructor(
    @Inject("IConversationRepository")
    private _conversationRepo: IConversationRepository
  ) { }
  async execute(query: GetChatStatusQuery): Promise<GetChatStatusResponse> {
    const { user } = query;
    const unSeenNum = await this._conversationRepo.getUnseenConversationNumber(user.id)
    return new GetChatStatusResponse(unSeenNum)
  }
}
