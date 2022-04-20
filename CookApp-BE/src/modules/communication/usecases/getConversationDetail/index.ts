import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { GetConversationDetailResponse } from "./getConversationDetailResponse";

export class GetConversationDetailQuery extends BaseQuery {
  conversationId: string;
  constructor(user: User, targetId: string) {
    super(user);
    this.conversationId = targetId
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
  ) { }
  async execute(query: GetConversationDetailQuery): Promise<GetConversationDetailResponse> {
    const { conversationId, user } = query

    const isMember = await this._convRepo.isMember(conversationId, user.id)

    if (!isMember) {
      throw new ForbiddenException(ResponseDTO.fail("Not in conversation"))
    }

    const conversation = await this._convRepo.findById(conversationId)

    if (!conversation) {
      throw new NotFoundException(ResponseDTO.fail("Conversation not found", UserErrorCode.CONVERSATION_NOT_FOUND))
    }

    const lastSeenMsg = await this._messageRepo.findLastSeenMessage(user.id, conversation.id)
    const isSeenAll = conversation.isSeenAll(lastSeenMsg)

    return new GetConversationDetailResponse(conversation, isSeenAll)
  }
}
