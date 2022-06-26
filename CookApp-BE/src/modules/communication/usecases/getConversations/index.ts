import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ConversationResponse } from "base/dtos/response.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { Image } from "domains/social/media.domain";
import { User } from "domains/social/user.domain";
import { MessageContentType } from "enums/social.enum";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
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
    @Inject("IConversationRepository")
    private _conversationRepo: IConversationRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IUserRepository")
    private _userRepo: IUserRepository
  ) {}
  async execute(
    query: GetConversationsQuery
  ): Promise<GetConversationsResponse> {
    const { user, queryOptions } = query;

    let memberIds: string[] = [];

    if (queryOptions.q) {
      const searchUserIds = await this._userRepo.findByDisplayName(
        queryOptions.q
      );
      if (searchUserIds.length === 0) return new GetConversationsResponse([]);
      memberIds = searchUserIds.map((user) => user.id);
    }

    const [conversations, total] = await this._conversationRepo.findByUserIds(
      user.id,
      queryOptions,
      memberIds
    );

    for (let conv of conversations) {
      let members = await this._conversationRepo.getMembers(conv.id, 3);
      members = members.filter((m) => m.id !== user.id);
      for (let member of members) {
        [member.avatar] = await this._storageService.getDownloadUrls([
          member.avatar,
        ]);
      }
      conv.fillNameAndCover(members);
    }

    let meta: PageMetadata;
    if (conversations.length > 0) {
      meta = new PageMetadata(queryOptions.offset, queryOptions.limit, total);
    }

    const tasks = conversations.map(async (conv) => {
      const lastSeenMsg = await this._messageRepo.findLastSeenMessage(
        user.id,
        conv.id
      );
      const isSeenAll = conv.isSeenAll(lastSeenMsg);

      const { lastMessage } = conv;

      if (lastMessage?.sender) {
        [lastMessage.sender.avatar] =
          await this._storageService.getDownloadUrls([
            lastMessage.sender.avatar,
          ]);
      }

      if (lastMessage?.message.type === MessageContentType.IMAGE) {
        conv.lastMessage.message.content = (
          await this._storageService.getDownloadUrls([
            new Image({ key: lastMessage.message.content }),
          ])
        )[0].url;
      }
      return new ConversationResponse(conv, isSeenAll);
    });

    return await Promise.all(tasks).then((data) => {
      return new GetConversationsResponse(data, meta);
    });
  }
}
