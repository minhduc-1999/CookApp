import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentModel } from "domains/schemas/comment.schema";
import { FeedModel } from "domains/schemas/feed.schema";
import { PostModel } from "domains/schemas/post.schema";
import { UserModel } from "domains/schemas/user.schema";
import { WallModel } from "domains/schemas/wall.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { CommentController } from "./adapters/in/comment.controller";
import { FeedController } from "./adapters/in/feed.controller";
import { PostController } from "./adapters/in/post.controller";
import { WallController } from "./adapters/in/wall.controller";
import { CommentRepository } from "./adapters/out/repositories/comment.repository";
import { FeedRepository } from "./adapters/out/repositories/feed.repository";
import { PostRepository } from "./adapters/out/repositories/post.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { CommentService } from "./services/comment.service";
import { PostService } from "./services/post.service";
import { CreateCommentCommandHandler } from "./useCases/createComment";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { EditPostCommandHandler } from "./useCases/editPost";
import { GetFeedPostsQueryHandler } from "./useCases/getFeedPosts";
import { GetPostDetailQueryHandler } from "./useCases/getPostById";
import { GetWallPostsQueryHandler } from "./useCases/getWallPosts";

const commandHandlers = [CreatePostCommandHandler, EditPostCommandHandler, CreateCommentCommandHandler];
const queryHandlers = [GetPostDetailQueryHandler, GetWallPostsQueryHandler, GetFeedPostsQueryHandler];
const services = [
  {
    provide: "IPostService",
    useClass: PostService,
  },
  {
    provide: "ICommentService",
    useClass: CommentService,
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
  {
    provide: "ICommentRepository",
    useClass: CommentRepository,
  },
];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([UserModel, PostModel, WallModel, FeedModel, CommentModel]),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: [PostController, WallController, FeedController, CommentController],
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
  ],
})
export class UserModule {}
