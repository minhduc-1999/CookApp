import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { AccountEntity } from "entities/social/account.entity";
import { AlbumEntity, AlbumMediaEntity } from "entities/social/album.entity";
import { CommentEntity, CommentMediaEntity } from "entities/social/comment.entity";
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
import { CoreModule } from "modules/core/core.module";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { AlbumController } from "./adapters/in/album.controller";
import { CommentController } from "./adapters/in/comment.controller";
import { FeedController } from "./adapters/in/feed.controller";
import { PostController } from "./adapters/in/post.controller";
import { ReactionController } from "./adapters/in/reaction.controller";
import { UserController } from "./adapters/in/user.controller";
import { WallController } from "./adapters/in/wall.controller";
import { AlbumRepository } from "./adapters/out/repositories/album.repository";
import { AlbumMediaRepository } from "./adapters/out/repositories/albumMedia.repository";
import { CommentRepository } from "./adapters/out/repositories/comment.repository";
import { CommentMediaRepository } from "./adapters/out/repositories/commentMedia.repository";
import { FeedRepository } from "./adapters/out/repositories/feed.repository";
import { FollowRepository } from "./adapters/out/repositories/follow.repository";
import { PostRepository } from "./adapters/out/repositories/post.repository";
import { PostMediaRepository } from "./adapters/out/repositories/postMedia.repository";
import { ReactionRepository } from "./adapters/out/repositories/reaction.repository";
import { SavedPostRepository } from "./adapters/out/repositories/savedPost.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { NewPostEventHandler } from "./events/propagateNewPost";
import { AlbumService } from "./services/album.service";
import { CommentService } from "./services/comment.service";
import { PostService } from "./services/post.service";
import { CreateAlbumCommandHandler } from "./useCases/createAlbum";
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
  DeleteSavedPostCommandHandler,
  CreateAlbumCommandHandler
];
const queryHandlers = [
  GetPostDetailQueryHandler,
  GetProfileQueryHandler,
  GetWallPostsQueryHandler,
  GetFeedPostsQueryHandler,
  GetCommentsQueryHandler,
  GetWallQueryHandler,
  GetUsersQueryHandler,
  GetSavedPostsQueryHandler,
];
const services = [
  {
    provide: "IPostService",
    useClass: PostService,
  },
  {
    provide: "IAlbumService",
    useClass: AlbumService,
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
  {
    provide: "ICommentMediaRepository",
    useClass: CommentMediaRepository,
  },
  {
    provide: "IAlbumRepository",
    useClass: AlbumRepository,
  },
  {
    provide: "IAlbumMediaRepository",
    useClass: AlbumMediaRepository,
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
    forwardRef(() => CoreModule),
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
      CommentEntity,
      CommentMediaEntity,
      AlbumEntity,
      AlbumMediaEntity
    ])
  ],
  controllers: [
    PostController,
    AlbumController,
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
  exports: [
    "IFollowRepository",
    "IReactionRepository",
    "ICommentRepository"
  ],
})
export class UserModule {}
