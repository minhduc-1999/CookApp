import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { AccountEntity } from "entities/social/account.entity";
import { CommentEntity } from "entities/social/comment.entity";
import { FeedEntity } from "entities/social/feed.entity";
import { FollowEntity } from "entities/social/follow.entity";
import { InteractionEntity } from "entities/social/interaction.entity";
import { PostEntity, PostMediaEntity } from "entities/social/post.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { SavedPostEntity } from "entities/social/savedPost.entity";
import { UserEntity } from "entities/social/user.entity";
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
import { FollowRepository } from "./adapters/out/repositories/follow.repository";
import { PostMediaRepository } from "./adapters/out/repositories/media.repository";
import { PostRepository } from "./adapters/out/repositories/post.repository";
import { ReactionRepository } from "./adapters/out/repositories/reaction.repository";
import { SavedPostRepository } from "./adapters/out/repositories/savedPost.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { NewPostEventHandler } from "./events/propagateNewPost";
import { CommentService } from "./services/comment.service";
import { PostService } from "./services/post.service";
import { CreateCommentCommandHandler } from "./useCases/createComment";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { DeleteSavedPostCommandHandler } from "./useCases/deleteSavedPost";
import { EditPostCommandHandler } from "./useCases/editPost";
import { FollowCommandHandler } from "./useCases/follow";
import { GetCommentsQueryHandler } from "./useCases/getComments";
import { GetFeedPostsQueryHandler } from "./useCases/getFeedPosts";
import { GetPostDetailQueryHandler } from "./useCases/getPostDetail";
import { GetProfileQueryHandler } from "./useCases/getProfile";
import { GetSavedPostsQueryHandler } from "./useCases/getSavedPosts";
import { GetUsersQueryHandler } from "./useCases/getUsers";
import { GetWallQueryHandler } from "./useCases/getWall";
import { GetWallPostsQueryHandler } from "./useCases/getWallPosts";
import { ReactCommandHandler } from "./useCases/react";
import { SavePostCommandHandler } from "./useCases/savePost";
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
  SavePostCommandHandler,
  DeleteSavedPostCommandHandler
];
const queryHandlers = [
  GetPostDetailQueryHandler,
  GetProfileQueryHandler,
  GetWallPostsQueryHandler,
  GetFeedPostsQueryHandler,
  GetCommentsQueryHandler,
  GetWallQueryHandler,
  GetUsersQueryHandler,
  GetSavedPostsQueryHandler
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
    provide: "IUserRepository",
    useClass: UserRepository,
  },
  {
    provide: "IFollowRepository",
    useClass: FollowRepository,
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
    provide: "PostMediaRepository",
    useClass: PostMediaRepository,
  },
  {
    provide: "IReactionRepository",
    useClass: ReactionRepository,
  },
  {
    provide: "ISavedPostRepository",
    useClass: SavedPostRepository,
  },
  {
    provide: "IPostMediaRepository",
    useClass: PostMediaRepository,
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
    TypeOrmModule.forFeature([
      UserEntity,
      AccountEntity,
      PostEntity,
      InteractionEntity,
      PostMediaEntity,
      FollowEntity,
      ReactionEntity,
      SavedPostEntity,
      FeedEntity,
      CommentEntity
    ])
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
  exports: ["IFollowRepository"],
})
export class UserModule {}
