import { Inject } from "@nestjs/common";
import { EventBus, IQueryHandler, ofType, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { MessageResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { NewMessageEvent } from "modules/communication/events/eventType";
import { filter, map, Observable } from "rxjs";

export class TransmitMessagesQuery extends BaseQuery {
  constructor(user: User) {
    super(user);
  }
}

@QueryHandler(TransmitMessagesQuery)
export class TransmitMessagesQueryHandler
  implements IQueryHandler<TransmitMessagesQuery>
{
  constructor(
    @Inject("IConversationRepository")
    private _conversationRepo: IConversationRepository,
    private _eventBus: EventBus
  ) { }
  async execute(query: TransmitMessagesQuery): Promise<Observable<MessageResponse>> {
    const { user } = query;

    const inConversations = await this._conversationRepo.findConversation(user.id)
    const convIds = inConversations.map(conv => conv.id)

    return this._eventBus.pipe(
      ofType(NewMessageEvent),
      filter((event: NewMessageEvent) => {
        return event?.message?.sender?.id != user.id && convIds.includes(event?.message?.to?.id)
      }),
      map((event: NewMessageEvent) => {
        return new MessageResponse(event.message)
      })
    )
  }

}
