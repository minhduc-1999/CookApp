import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { FoodEntity, FoodMediaEntity } from "entities/core/food.entity";
import { FoodIngredientEntity } from "entities/core/foodIngredient.entity";
import {
  RecipeStepEntity,
  RecipeStepMediaEntity,
} from "entities/core/recipeStep.entity";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { UserModule } from "modules/user/user.module";
import { ConfigModule } from "nestjs-config";
import { FoodController } from "./adapters/in/food.controller";
import { FoodRepository } from "./adapters/out/repositories/food.repository";
import { RecipeStepRepository } from "./adapters/out/repositories/recipeStep.repository";
import { FoodSeService } from "./adapters/out/services/foodSe.service";
import { FoodModel } from "./entities/se/food.schema";
import { FoodRecipeService } from "./services/recipeStep.service";
import { CreateFoodCommandHandler } from "./useCases/createFood";
import { GetFoodDetailQueryHandler } from "./useCases/getFoodDetail";
import { GetFoodsQueryHandler } from "./useCases/getFoods";

const commandHandlers = [CreateFoodCommandHandler];
const queryHandlers = [GetFoodsQueryHandler, GetFoodDetailQueryHandler];

const services = [
  {
    provide: "IFoodRecipeService",
    useClass: FoodRecipeService,
  },
  {
    provide: "IFoodSeService",
    useClass: FoodSeService,
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
];
const controller = [FoodController];
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
  ],
  exports: ["IFoodRecipeService", "IFoodRepository", "IFoodSeService"],
})
export class CoreModule {}
