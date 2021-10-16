import { HttpModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";
import { JwtAuthGuard } from "guards/jwt_auth.guard";
import { ConfigModule } from "nestjs-config";
import { PostController } from "./adapters/in/post.controller";
import { PostModel } from "./domains/schemas/post.schema";
import { UserModel } from "./domains/schemas/user.schema";
import { PostService } from "./services/post.service";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([UserModel, PostModel]),
    CqrsModule,
  ],
  controllers: [PostController],
  providers: [
    {
      provide: "IPostService",
      useClass: PostService,
    },
    
  ],
})
export class UserModule {}
