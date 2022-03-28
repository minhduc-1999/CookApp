import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { FoodEntity, FoodMediaEntity } from "entities/core/food.entity";
import { FoodIngredientEntity } from "entities/core/foodIngredient.entity";
import { RecipeStepEntity, RecipeStepMediaEntity } from "entities/core/recipeStep.entity";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { FoodController } from "./adapters/in/food.controller";
import { FoodRepository } from "./adapters/out/repositories/food.repository";
import { RecipeStepRepository } from "./adapters/out/repositories/recipeStep.repository";
import { FoodRecipeService } from "./services/recipeStep.service";
import { GetFoodDetailQueryHandler } from "./useCases/getFoodDetail";
import { GetFoodsQueryHandler } from "./useCases/getFoods";

const commandHandlers = [];
const queryHandlers = [
  GetFoodsQueryHandler,
  GetFoodDetailQueryHandler
];
const services = [
  {
    provide: "IFoodRecipeService",
    useClass: FoodRecipeService,
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
      RecipeStepMediaEntity
    ])
  ],
  controllers: controller,
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
  ],
  exports: [
    "IFoodRecipeService"
  ]
})
export class CoreModule {}
