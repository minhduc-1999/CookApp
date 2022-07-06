import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { AccountEntity } from "entities/social/account.entity";
import { AlbumEntity, AlbumMediaEntity } from "entities/social/album.entity";
import {
  CommentEntity,
  CommentMediaEntity,
} from "entities/social/comment.entity";
import { FeedEntity } from "entities/social/feed.entity";
import { FollowEntity } from "entities/social/follow.entity";
import { InteractionEntity } from "entities/social/interaction.entity";
import { PostEntity, PostMediaEntity } from "entities/social/post.entity";
import { ReactionEntity } from "entities/social/reaction.entity";
import { PostSaveEntity } from "entities/social/PostSave.entity";
import { TopicEntity, UserTopicEntity } from "entities/social/topic.entity";
import { UserEntity } from "entities/social/user.entity";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { UserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { AuthModule } from "modules/auth/auth.module";
import { CommunicationModule } from "modules/communication/communication.module";
import { CoreModule } from "modules/core/core.module";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { AlbumController } from "./adapters/in/album.controller";
import { CommentController } from "./adapters/in/comment.controller";
import { FeedController } from "./adapters/in/feed.controller";
import { PostController } from "./adapters/in/post.controller";
import { ReactionController } from "./adapters/in/reaction.controller";
import { TopicController } from "./adapters/in/topic.controller";
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
import { SavedPostRepository } from "./adapters/out/repositories/postSave.repository";
import { TopicRepository } from "./adapters/out/repositories/topic.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import { PropagatePostCreatedEventHandler } from "./events/propagateNewPost";
import {
  InterestsChosenEventHandler,
  UserProfileUpdatedEventHandler,
} from "./events/syncSeData";
import { AlbumService } from "./services/album.service";
import { CommentService } from "./services/comment.service";
import { PostService } from "./services/post.service";
import { ChooseInterestsCommandHandler } from "./useCases/chooseInterests";
import { CreateAlbumCommandHandler } from "./useCases/createAlbum";
import { CreateCommentCommandHandler } from "./useCases/createComment";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { CreateTopicCommandHandler } from "./useCases/createTopic";
import { DeleteSavedPostCommandHandler } from "./useCases/deleteSavedPost";
import { EditAlbumCommandHandler } from "./useCases/editAlbum";
import { EditPostCommandHandler } from "./useCases/editPost";
import { FollowCommandHandler } from "./useCases/follow";
import { GetAlbumDetailQueryHandler } from "./useCases/getAlbumDetail";
import { GetAlbumsQueryHandler } from "./useCases/getAlbums";
import { GetCommentsQueryHandler } from "./useCases/getComments";
import { GetFeedPostsQueryHandler } from "./useCases/getFeedPosts";
import { GetInterestedTopicsQueryHandler } from "./useCases/getInterestedTopics";
import { GetPostDetailQueryHandler } from "./useCases/getPostDetail";
import { GetProfileQueryHandler } from "./useCases/getProfile";
import { GetSavedPostsQueryHandler } from "./useCases/getSavedPosts";
import { GetTopicsQueryHandler } from "./useCases/getTopics";
import { GetUsersQueryHandler } from "./useCases/getUsers";
import { GetWallQueryHandler } from "./useCases/getWall";
import { GetWallPostsQueryHandler } from "./useCases/getWallPosts";
import { ReactCommandHandler } from "./useCases/react";
import { SavePostCommandHandler } from "./useCases/savePost";
import { UnfolllowCommandHandler } from "./useCases/unfollow";
import { UpdateProfileCommandHandler } from "./useCases/updateProfile";
import { SendRequestUseCase } from "./useCases/sendRequest";
import { RequestEntity } from "entities/social/request.entity";
import { CertificateEntity } from "entities/social/certificate.entity";
import { RequestController } from "./adapters/in/request.controller";
import { RequestRepository } from "./adapters/out/repositories/request.repository";
import { CertificateRepository } from "./adapters/out/repositories/certificate.repository";
import { CertificateService } from "./services/certificate.service";
import { GetCertsUseCase } from "./useCases/getCertificates";
import { CertificateController } from "./adapters/in/cert.controller";
import { GetOwnRequestsUseCase } from "./useCases/getOwnRequests";
import { GetAllRequestsUseCase } from "./useCases/getAllRequests";
import { AdminController } from "./adapters/in/admin.controller";
import { ConfirmCertUseCase } from "./useCases/confirmCertRequest";
import { ConfirmRequestUseCase } from "./useCases/confirmRequest";

const eventHandlers = [
  PropagatePostCreatedEventHandler,
  InterestsChosenEventHandler,
  UserProfileUpdatedEventHandler,
];
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
  CreateAlbumCommandHandler,
  EditAlbumCommandHandler,
  ChooseInterestsCommandHandler,
  CreateTopicCommandHandler,
  SendRequestUseCase,
  ConfirmCertUseCase,
  ConfirmRequestUseCase
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
  GetAlbumsQueryHandler,
  GetAlbumDetailQueryHandler,
  GetTopicsQueryHandler,
  GetInterestedTopicsQueryHandler,
  GetOwnRequestsUseCase,
  GetCertsUseCase,
  GetAllRequestsUseCase
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
  {
    provide: "ICertificateService",
    useClass: CertificateService
  }
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
  {
    provide: "ITopicRepository",
    useClass: TopicRepository,
  },
  {
    provide: "IRequestRepository",
    useClass: RequestRepository,
  },
  {
    provide: "ICertificateRepository",
    useClass: CertificateRepository,
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
      PostSaveEntity,
      FeedEntity,
      CommentEntity,
      CommentMediaEntity,
      AlbumEntity,
      AlbumMediaEntity,
      TopicEntity,
      UserTopicEntity,
      RequestEntity,
      CertificateEntity
    ]),
    forwardRef(() => CommunicationModule),
    forwardRef(() => CoreModule),
  ],
  controllers: [
    PostController,
    AlbumController,
    WallController,
    FeedController,
    CommentController,
    UserController,
    ReactionController,
    TopicController,
    RequestController,
    CertificateController,
    AdminController
  ],
  providers: [
    ...commandHandlers,
    ...services,
    ...repositories,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: ["IFollowRepository", "IReactionRepository", "ICommentRepository"],
})
export class UserModule {}
