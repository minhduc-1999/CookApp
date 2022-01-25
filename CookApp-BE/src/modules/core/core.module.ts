import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { FoodModel } from "schemas/core/food.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { FoodController } from "./adapters/in/food.controller";
import { FoodRepository } from "./adapters/out/repositories/food.repository";
import { GetFoodsQueryHandler } from "./useCases/getFoods";

const commandHandlers = [];
const queryHandlers = [GetFoodsQueryHandler];
const services = [];
const repositories = [
  {
    provide: "IFoodRepository",
    useClass: FoodRepository,
  },
];
const controller = [FoodController];
const model = [FoodModel];
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature(model),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: controller,
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
  ],
})
export class CoreModule {}
