import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentModel } from "domains/schemas/social/comment.schema";
import { FeedModel } from "domains/schemas/social/feed.schema";
import { PostModel } from "domains/schemas/social/post.schema";
import { UserModel } from "domains/schemas/social/user.schema";
import { WallModel } from "domains/schemas/social/wall.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";

const commandHandlers = [];
const queryHandlers = [];
const services = [];
const repositories = [];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      UserModel,
      PostModel,
      WallModel,
      FeedModel,
      CommentModel,
    ]),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: [],
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
  ],
})
export class CoreModule {}
