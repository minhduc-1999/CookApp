import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedModel } from "domains/schemas/social/feed.schema";
import { PostModel } from "domains/schemas/social/post.schema";
import { UserModel } from "domains/schemas/social/user.schema";
import { WallModel } from "domains/schemas/social/wall.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { AuthModule } from "modules/auth/auth.module";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { CommentController } from "./adapters/in/comment.controller";
import { FeedController } from "./adapters/in/feed.controller";
import { PostController } from "./adapters/in/post.controller";
import { UserController } from "./adapters/in/user.controller";
import { WallController } from "./adapters/in/wall.controller";
import { CommentRepository } from "./adapters/out/neo4j-repositories/comment.repository";
import { PostRepository } from "./adapters/out/neo4j-repositories/post.repository";
import { FeedRepository } from "./adapters/out/repositories/feed.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { CommentService } from "./services/comment.service";
import { PostService } from "./services/post.service";
import { CreateCommentCommandHandler } from "./useCases/createComment";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { EditPostCommandHandler } from "./useCases/editPost";
import { FollowCommandHandler } from "./useCases/follow";
import { GetFeedPostsQueryHandler } from "./useCases/getFeedPosts";
import { GetPostDetailQueryHandler } from "./useCases/getPostById";
import { GetPostCommentsQueryHandler } from "./useCases/getPostComments";
import { GetUsersQueryHandler } from "./useCases/getUsers";
import { GetWallQueryHandler } from "./useCases/getWall";
import { GetWallPostsQueryHandler } from "./useCases/getWallPosts";
import { ReactPostCommandHandler } from "./useCases/reactPost";
import { UnfolllowCommandHandler } from "./useCases/unfollow";

const commandHandlers = [
  CreatePostCommandHandler,
  EditPostCommandHandler,
  CreateCommentCommandHandler,
  ReactPostCommandHandler,
  FollowCommandHandler,
  UnfolllowCommandHandler,
];
const queryHandlers = [
  GetPostDetailQueryHandler,
  GetWallPostsQueryHandler,
  GetFeedPostsQueryHandler,
  GetPostCommentsQueryHandler,
  GetWallQueryHandler,
  GetUsersQueryHandler,
];
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
    MongooseModule.forFeature([
      UserModel,
      PostModel,
      WallModel,
      FeedModel,
    ]),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
    AuthModule,
  ],
  controllers: [
    PostController,
    WallController,
    FeedController,
    CommentController,
    UserController,
  ],
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
  ],
  exports: ["IWallRepository"],
})
export class UserModule {}
