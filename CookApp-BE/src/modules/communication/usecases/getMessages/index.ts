import {
  ForbiddenException,
  Inject,
  NotFoundException,
  Response,
} from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { Image } from "domains/social/media.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { MessageContentType } from "enums/social.enum";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetMessagesResponse } from "./getMessagesResponse";

export class GetMessagesQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  conversationId: string;
  constructor(user: User, convId: string, queryOptions: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
    this.conversationId = convId;
  }
}

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  constructor(
    @Inject("IMessageRepository")
    private _messageRepo: IMessageRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IConversationRepository")
    private _conversationRepo: IConversationRepository
  ) {}
  async execute(query: GetMessagesQuery): Promise<GetMessagesResponse> {
    const { user, queryOptions, conversationId } = query;

    const conversation = await this._conversationRepo.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException(
        ResponseDTO.fail(
          "Conversation not found",
          UserErrorCode.CONVERSATION_NOT_FOUND
        )
      );
    }

    const inConversation = await this._conversationRepo.isMember(
      conversationId,
      user.id
    );

    if (!inConversation) {
      throw new ForbiddenException(ResponseDTO.fail("Not in conversation"));
    }

    const [msgs, total] = await this._messageRepo.getMessages(
      conversationId,
      queryOptions
    );

    for (let msg of msgs) {
      [msg.sender.avatar] = await this._storageService.getDownloadUrls([
        msg?.sender?.avatar,
      ]);
      if (msg.message.type === MessageContentType.IMAGE) {
        msg.message.content = (
          await this._storageService.getDownloadUrls([
            new Image({ key: msg.message.content }),
          ])
        )[0].url;
      }
    }

    let meta: PageMetadata;
    if (msgs.length > 0) {
      meta = new PageMetadata(queryOptions.offset, queryOptions.limit, total);
    }

    return new GetMessagesResponse(msgs, meta);
  }
}
