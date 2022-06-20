import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { Image } from "domains/social/media.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { MessageContentType } from "enums/social.enum";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetConversationDetailResponse } from "./getConversationDetailResponse";

export class GetConversationDetailQuery extends BaseQuery {
  conversationId: string;
  constructor(user: User, targetId: string) {
    super(user);
    this.conversationId = targetId;
  }
}

@QueryHandler(GetConversationDetailQuery)
export class GetConversationDetailQueryHandler
  implements IQueryHandler<GetConversationDetailQuery>
{
  constructor(
    @Inject("IConversationRepository")
    private _convRepo: IConversationRepository,
    @Inject("IMessageRepository")
    private _messageRepo: IMessageRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async execute(
    query: GetConversationDetailQuery
  ): Promise<GetConversationDetailResponse> {
    const { conversationId, user } = query;

    const isMember = await this._convRepo.isMember(conversationId, user.id);

    if (!isMember) {
      throw new ForbiddenException(ResponseDTO.fail("Not in conversation"));
    }

    const conversation = await this._convRepo.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException(
        ResponseDTO.fail(
          "Conversation not found",
          UserErrorCode.CONVERSATION_NOT_FOUND
        )
      );
    }
    const { lastMessage } = conversation;

    if (lastMessage.message.type === MessageContentType.IMAGE) {
      conversation.lastMessage.message.content = (
        await this._storageService.getDownloadUrls([
          new Image({ key: lastMessage.message.content }),
        ])
      )[0].url;
    }

    const lastSeenMsg = await this._messageRepo.findLastSeenMessage(
      user.id,
      conversation.id
    );
    const isSeenAll = conversation.isSeenAll(lastSeenMsg);

    return new GetConversationDetailResponse(conversation, isSeenAll);
  }
}
