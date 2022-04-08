import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetConversationsResponse } from "./getMessagesResponse";

export class GetConversationsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetConversationsQuery)
export class GetConversationsQueryHandler
  implements IQueryHandler<GetConversationsQuery>
{
  constructor(
    @Inject("IMessageRepository")
    private _messageRepo: IMessageRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IConversationRepository")
    private _conversationRepo: IConversationRepository
  ) { }
  async execute(query: GetConversationsQuery): Promise<GetConversationsResponse> {
    const { user, queryOptions } = query;

    const [conversations, total] = await this._conversationRepo.findMany(user.id, queryOptions)

    let meta: PageMetadata;
    if (conversations.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        total
      );
    }

    return new GetConversationsResponse(conversations, meta);
  }
}
