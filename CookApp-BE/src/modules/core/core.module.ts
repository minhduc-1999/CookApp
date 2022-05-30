import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { FoodEntity, FoodMediaEntity } from "entities/core/food.entity";
import { FoodIngredientEntity } from "entities/core/foodIngredient.entity";
import { FoodSaveEntity } from "entities/core/foodSave.entity";
import { FoodVoteEntity } from "entities/core/foodVote.entity";
import { IngredientEntity, UnitEntity } from "entities/core/ingredient.entity";
import {
  RecipeStepEntity,
  RecipeStepMediaEntity,
} from "entities/core/recipeStep.entity";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { UserModule } from "modules/user/user.module";
import { ConfigModule } from "nestjs-config";
import { FoodController } from "./adapters/in/food.controller";
import { IngredientController } from "./adapters/in/ingredient.controller";
import { UnitController } from "./adapters/in/unit.controller";
import { FoodRepository } from "./adapters/out/repositories/food.repository";
import { FoodVoteRepository } from "./adapters/out/repositories/foodVote.repository";
import { IngredientRepository } from "./adapters/out/repositories/ingredient.repository";
import { RecipeStepRepository } from "./adapters/out/repositories/recipeStep.repository";
import { UnitRepository } from "./adapters/out/repositories/unit.repository";
import { FoodSeService } from "./adapters/out/services/foodSe.service";
import { FoodModel } from "./entities/se/food.schema";
import { SyncFoodCreatedEventHandler } from "./events/syncSeData";
import { FoodService } from "./services/food.service";
import { FoodRecipeService } from "./services/recipeStep.service";
import { ConfirmFoodCommandHandler } from "./useCases/confirmFood";
import { CreateFoodCommandHandler } from "./useCases/createFood";
import { CreateIngredientCommandHandler } from "./useCases/createIngredient";
import { CreateUnitCommandHandler } from "./useCases/createUnit";
import { EditVoteCommandHandler } from "./useCases/editVote";
import { GetFoodDetailQueryHandler } from "./useCases/getFoodDetail";
import { GetFoodsQueryHandler } from "./useCases/getFoods";
import { GetFoodSavesQueryHandler } from "./useCases/getFoodSaves";
import { GetFoodVotesQueryHandler } from "./useCases/getFoodVotes";
import { GetIngredientsQueryHandler } from "./useCases/getIngredients";
import { GetUncensoredFoodsQueryHandler } from "./useCases/getUncensoredFoods";
import { GetUnitsQueryHandler } from "./useCases/getUnits";
import { GetVoteQueryHandler } from "./useCases/getVote";
import { SaveFoodCommandHandler } from "./useCases/saveFood";
import { VoteFoodCommandHandler } from "./useCases/voteFood";

const commandHandlers = [
  CreateFoodCommandHandler,
  VoteFoodCommandHandler,
  EditVoteCommandHandler,
  CreateUnitCommandHandler,
  CreateIngredientCommandHandler,
  ConfirmFoodCommandHandler,
  SaveFoodCommandHandler
];
const queryHandlers = [
  GetFoodsQueryHandler,
  GetFoodDetailQueryHandler,
  GetUnitsQueryHandler,
  GetIngredientsQueryHandler,
  GetFoodVotesQueryHandler,
  GetVoteQueryHandler,
  GetUncensoredFoodsQueryHandler,
  GetFoodSavesQueryHandler
];

const eventHandlers = [SyncFoodCreatedEventHandler];

const services = [
  {
    provide: "IFoodRecipeService",
    useClass: FoodRecipeService,
  },
  {
    provide: "IFoodSeService",
    useClass: FoodSeService,
  },
  {
    provide: "IFoodService",
    useClass: FoodService,
  },
];
const repositories = [
  {
    provide: "IFoodRepository",
    useClass: FoodRepository,
  },
  {
    provide: "IRecipeStepRepository",
    useClass: RecipeStepRepository,
  },
  {
    provide: "IUnitRepository",
    useClass: UnitRepository,
  },
  {
    provide: "IIngredientRepository",
    useClass: IngredientRepository,
  },
  {
    provide: "IFoodVoteRepository",
    useClass: FoodVoteRepository,
  },
];
const controller = [FoodController, IngredientController, UnitController];
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
    TypeOrmModule.forFeature([
      FoodEntity,
      FoodMediaEntity,
      FoodIngredientEntity,
      RecipeStepEntity,
      RecipeStepMediaEntity,
      UnitEntity,
      IngredientEntity,
      FoodVoteEntity,
      FoodSaveEntity
    ]),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([FoodModel]),
  ],
  controllers: controller,
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [
    "IFoodRecipeService",
    "IFoodRepository",
    "IFoodSeService",
    "IFoodService",
  ],
})
export class CoreModule {}
