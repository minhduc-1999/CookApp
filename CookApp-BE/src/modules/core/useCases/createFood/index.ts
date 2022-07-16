import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { Image } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { MediaType } from "enums/social.enum";
import { CreateFoodResponse } from "./createFoodResponse";
import { CreateFoodRequest } from "./createFoodRequest";
import { Food } from "domains/core/food.domain";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { FoodIngredient } from "domains/core/ingredient.domain";

export class CreateFoodCommand extends BaseCommand {
  req: CreateFoodRequest;
  constructor(user: User, foodReq: CreateFoodRequest, tx: ITransaction) {
    super(tx, user);
    this.req = foodReq;
  }
}

@CommandHandler(CreateFoodCommand)
export class CreateFoodCommandHandler
  implements ICommandHandler<CreateFoodCommand>
{
  constructor(
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository
  ) {}
  async execute(command: CreateFoodCommand): Promise<CreateFoodResponse> {
    const { req, user, tx } = command;

    if (req.photos?.length > 0) {
      req.photos = await this._storageService.makePublic(
        req.photos,
        MediaType.IMAGE,
        "food"
      );
    }

    const foodMedias = req.photos?.map((image) => new Image({ key: image }));

    let steps: RecipeStep[] = [];
    for (let step of req.steps) {
      step.photos =
        step.photos &&
        (await this._storageService.makePublic(
          step.photos,
          MediaType.IMAGE,
          "recipe-step"
        ));
      const item = new RecipeStep({
        content: step.content,
        photos:
          step.photos &&
          step.photos.map(
            (photo) =>
              new Image({
                key: photo,
              })
          ),
      });
      steps.push(item);
    }

    const food = new Food({
      name: req.name,
      servings: req.servings,
      photos: foodMedias,
      description: req.description,
      totalTime: req.totalTime,
      steps,
      ingredients:
        req?.ingredients &&
        req.ingredients.map((ing) => new FoodIngredient(ing)),
      videoUrl: req?.videoUrl,
      url: req?.url,
      author: user,
    });

    food.calculateKcal();

    food.setCensoredStatus(user.account.role.sign);

    const savedFood = await this._foodRepo.setTransaction(tx).insertFood(food);

    return new CreateFoodResponse(savedFood.id);
  }
}
