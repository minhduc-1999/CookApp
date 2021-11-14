import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { PostModel } from "domains/schemas/post.schema";
import { UserModel } from "domains/schemas/user.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { PostController } from "./adapters/in/post.controller";
import { PostRepository } from "./adapters/out/post.repository";
import { PostService } from "./services/post.service";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { EditPostCommandHandler } from "./useCases/editPost";
import { GetPostDetailQueryHandler } from "./useCases/getPostById";

const commandHandlers = [CreatePostCommandHandler, EditPostCommandHandler];
const queryHandlers = [GetPostDetailQueryHandler];
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
];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([UserModel, PostModel]),
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
