import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { FoodIngredient } from "domains/core/ingredient.domain";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { User } from "domains/social/user.domain";
import { BotActionType, MessageContentType } from "enums/social.enum";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { IFoodSeService } from "modules/core/adapters/out/services/foodSe.service";
import { INlpServcie } from "modules/share/adapters/out/services/nlp.service";
import { SpeakToBotRequest } from "./speakToBotRequest";
import { SpeakToBotResponse } from "./speakToBotResponse";

export class SpeakToBotCommand extends BaseCommand {
  req: SpeakToBotRequest;
  constructor(
    user: User,
    request: SpeakToBotRequest,
    tx: ITransaction
  ) {
    super(tx, user);
    this.req = request;
  }
}

@CommandHandler(SpeakToBotCommand)
export class SpeakToBotCommandHandler
  implements ICommandHandler<SpeakToBotCommand>
{
  constructor(
    @Inject("INlpService")
    private _nlpService: INlpServcie,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IFoodSeService")
    private _foodSeService: IFoodSeService
  ) { }

  async execute(command: SpeakToBotCommand): Promise<SpeakToBotResponse> {
    const { req } = command

    const botRes = await this._nlpService.detectIntent(command.req.message, req.botSessionID)
    let response: SpeakToBotResponse
    if (botRes.endInteraction) {
      const foodId = await this._foodSeService.findOneByName(botRes.parameters.fields.food.stringValue)
      let attachment: FoodIngredient[] | RecipeStep[]
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
      response = new SpeakToBotResponse(botRes.fulfillmentText, true, botRes.sessionID, attachment, attachmentType)
    } else {
      response = new SpeakToBotResponse(botRes.fulfillmentText, false, botRes.sessionID, null, MessageContentType.TEXT)
    }

    return response
  }
}
