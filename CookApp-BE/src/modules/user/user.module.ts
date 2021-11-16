import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedModel } from "domains/schemas/feed.schema";
import { PostModel } from "domains/schemas/post.schema";
import { UserModel } from "domains/schemas/user.schema";
import { WallModel } from "domains/schemas/wall.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { PostController } from "./adapters/in/post.controller";
import { FeedRepository } from "./adapters/out/repositories/feed.repository";
import { PostRepository } from "./adapters/out/repositories/post.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { PostService } from "./services/post.service";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { EditPostCommandHandler } from "./useCases/editPost";
import { GetPostDetailQueryHandler } from "./useCases/getPostById";
import { GetWallPostsQueryHandler } from "./useCases/getWallPosts";

const commandHandlers = [CreatePostCommandHandler, EditPostCommandHandler];
const queryHandlers = [GetPostDetailQueryHandler, GetWallPostsQueryHandler];
const services = [
  {
    provide: "IPostService",
    useClass: PostService,
  },
];
const repositories = [
  {
    provide: "IPostRepository",
    useClass: PostRepository,
  },
  {
    provide: "IWallRepository",
    useClass: WallRepository,
  },
  {
    provide: "IFeedRepository",
    useClass: FeedRepository,
  },
];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([UserModel, PostModel, WallModel, FeedModel]),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: [PostController],
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
  ],
})
export class UserModule {}
