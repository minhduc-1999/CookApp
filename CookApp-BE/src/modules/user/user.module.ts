import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { UserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { AuthModule } from "modules/auth/auth.module";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { CommentController } from "./adapters/in/comment.controller";
import { FeedController } from "./adapters/in/feed.controller";
import { PostController } from "./adapters/in/post.controller";
import { ReactionController } from "./adapters/in/reaction.controller";
import { UserController } from "./adapters/in/user.controller";
import { WallController } from "./adapters/in/wall.controller";
import { CommentRepository } from "./adapters/out/repositories/comment.repository";
import { FeedRepository } from "./adapters/out/repositories/feed.repository";
import { MediaRepository } from "./adapters/out/repositories/media.repository";
import { PostRepository } from "./adapters/out/repositories/post.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { NewPostEventHandler } from "./events/propagateNewPost";
import { CommentService } from "./services/comment.service";
import { PostService } from "./services/post.service";
import { ReactionService } from "./services/reaction.service";
import { CreateCommentCommandHandler } from "./useCases/createComment";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { EditPostCommandHandler } from "./useCases/editPost";
import { FollowCommandHandler } from "./useCases/follow";
import { GetFeedPostsQueryHandler } from "./useCases/getFeedPosts";
import { GetPostDetailQueryHandler } from "./useCases/getPostById";
import { GetPostCommentsQueryHandler } from "./useCases/getPostComments";
import { GetProfileQueryHandler } from "./useCases/getProfile";
import { GetUsersQueryHandler } from "./useCases/getUsers";
import { GetWallQueryHandler } from "./useCases/getWall";
import { GetWallPostsQueryHandler } from "./useCases/getWallPosts";
import { ReactCommandHandler } from "./useCases/react";
import { UnfolllowCommandHandler } from "./useCases/unfollow";
import { UpdateProfileCommandHandler } from "./useCases/updateProfile";

const eventHandlers = [
  NewPostEventHandler
]
const commandHandlers = [
  CreatePostCommandHandler,
  EditPostCommandHandler,
  CreateCommentCommandHandler,
  ReactCommandHandler,
  FollowCommandHandler,
  UnfolllowCommandHandler,
  UpdateProfileCommandHandler,
];
const queryHandlers = [
  GetPostDetailQueryHandler,
  GetProfileQueryHandler,
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
  {
    provide: "IReactionService",
    useClass: ReactionService,
  },
];
const repositories = [
  {
    provide: "IUserRepository",
    useClass: UserRepository,
  },
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
  {
    provide: "IMediaRepository",
    useClass: MediaRepository,
  },
];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
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
    ReactionController,
  ],
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
    ...eventHandlers
  ],
  exports: ["IWallRepository"],
})
export class UserModule {}
