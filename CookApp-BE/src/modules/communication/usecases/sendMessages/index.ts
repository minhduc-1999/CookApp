import { ForbiddenException, Inject, MethodNotAllowedException, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { BotResponse, ResponseDTO } from "base/dtos/response.dto";
import { isUUID } from "class-validator";
import { Ingredient } from "domains/core/ingredient.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { Message } from "domains/social/conversation.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { BotActionType, ConversationType, MessageContentType } from "enums/social.enum";
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IMessageRepository } from "modules/communication/adapters/out/message.repository";
import { NewMessageEvent } from "modules/communication/events/eventType";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { IFoodSeService } from "modules/core/adapters/out/services/foodSe.service";
import { INlpServcie } from "modules/share/adapters/out/services/nlp.service";
import { SendMessageRequest } from "./sendMessageRequest";
import { SendMessageResponse } from "./sendMessageResponse";

export class SendMessageCommand extends BaseCommand {
  commentReq: SendMessageRequest;
  constructor(
    user: User,
    request: SendMessageRequest,
    tx: ITransaction
  ) {
    super(tx, user);
    this.commentReq = request;
  }
}

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(
    @Inject("IConversationRepository")
    private _convRepo: IConversationRepository,
    @Inject("IMessageRepository")
    private _msgRepo: IMessageRepository,
    private _eventBus: EventBus,
    @Inject("INlpService")
    private _nlpService: INlpServcie,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IFoodSeService")
    private _foodSeService: IFoodSeService
  ) { }
  async execute(command: SendMessageCommand): Promise<SendMessageResponse> {
    const { user, commentReq, tx } = command

    if (isUUID(commentReq.to)) {
      //Check conversation existed
      const conversation = await this._convRepo.findById(commentReq.to)

      if (!conversation) {
        throw new NotFoundException(ResponseDTO.fail("Conversation not found", UserErrorCode.CONVERSATION_NOT_FOUND))
      }

      //Check if user in conversation
      const isMember = await this._convRepo.isMember(conversation.id, user.id)

      if (!isMember) {
        throw new ForbiddenException(ResponseDTO.fail("Not in conversation"))
      }

      let msg = user.inbox(conversation, commentReq.message, commentReq.type)

      let result: Message;

      switch (conversation.type) {
        case ConversationType.DIRECT:
          result = await this._msgRepo.setTransaction(tx).createMessage(msg)
          result.sender = user
          this._eventBus.publish(new NewMessageEvent(result))
          return new SendMessageResponse(result)
        default:
          throw new MethodNotAllowedException()
      }
    }

    if (commentReq.to === "BOT") {
      const botRes = await this._nlpService.detectIntent(command.commentReq.message, commentReq.botSessionID)
      let response: BotResponse
      if (botRes.endInteraction) {
        const foodId = await this._foodSeService.findOneByName(botRes.parameters.fields.food.stringValue)
        let attachment: (Ingredient | RecipeStep)[]
        let attachmentType: MessageContentType
        switch (botRes.action) {
          case BotActionType.SHOW_INGREDIENT: {
            attachment = await this._foodRepo.getIngredients(foodId)
            attachmentType = MessageContentType.INGREDIENT
            break;
          }
          case BotActionType.SHOW_RECIPE: {
            attachment = await this._foodRepo.getSteps(foodId)
            attachmentType = MessageContentType.RECIPE
            break;
          }
        }
        response = new BotResponse(botRes.fulfillmentText, true, botRes.sessionID, attachment, attachmentType)
      } else {
        response = new BotResponse(botRes.fulfillmentText, false, botRes.sessionID, null, MessageContentType.TEXT)
      }

      return new SendMessageResponse(response)
    }

    throw new MethodNotAllowedException()

  }
}
