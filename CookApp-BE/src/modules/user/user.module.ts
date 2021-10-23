import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";
import { ConfigModule } from "nestjs-config";
import { PostController } from "./adapters/in/post.controller";
import { PostRepository } from "./adapters/out/post.repository";
import { PostModel } from "./domains/schemas/post.schema";
import { UserModel } from "./domains/schemas/user.schema";
import { PostService } from "./services/post.service";
import { CreatePostCommandHandler } from "./useCases/createPost";
import { GetPostDetailQueryHandler } from "./useCases/getPostById";

const commandHandlers = [CreatePostCommandHandler];
const queryHandlers = [GetPostDetailQueryHandler]
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
  ],
  controllers: [PostController],
  providers: [...commandHandlers, ...services, ...repositories, ...queryHandlers],
})
export class UserModule {}
