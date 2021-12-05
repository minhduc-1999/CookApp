import { HttpModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedModel } from "domains/schemas/social/feed.schema";
import { UserModel } from "domains/schemas/social/user.schema";
import { WallModel } from "domains/schemas/social/wall.schema";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { JwtAuthGuard } from "guards/jwt_auth.guard";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { AuthController } from "./adapters/in/auth.controller";
import { UserController } from "./adapters/in/user.controller";
import { FeedRepository } from "./adapters/out/repositories/feed.repository";
import { UserRepository } from "./adapters/out/repositories/user.repository";
import { WallRepository } from "./adapters/out/repositories/wall.repository";
import AuthenticationService from "./services/authentication.service";
import UserService from "./services/user.service";
import { BasicAuthStrategy } from "./strategies/basicAuth.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GetProfileQueryHandler } from "./useCases/getProfile";
import { LoginCommandHandler } from "./useCases/login";
import { RegisterCommandHandler } from "./useCases/register";
import { UpdateProfileCommandHandler } from "./useCases/updateProfile";
@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([UserModel, WallModel, FeedModel]),
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    {
      provide: "IUserService",
      useClass: UserService,
    },
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "IAuthentication",
      useClass: AuthenticationService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: "IWallRepository",
      useClass: WallRepository,
    },
    {
      provide: "IFeedRepository",
      useClass: FeedRepository,
    },
    RegisterCommandHandler,
    LoginCommandHandler,
    UpdateProfileCommandHandler,
    GetProfileQueryHandler,
    BasicAuthStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
