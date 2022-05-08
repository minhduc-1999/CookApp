import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import {
    AccountEntity,
    AccountRoleEntity
} from "entities/social/account.entity";
import { ProviderEntity } from "entities/social/provider.entity";
import { UserEntity } from "entities/social/user.entity";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { EmailVerificationGuard } from "guards/emailVerification.guard";
import { JwtAuthGuard } from "guards/jwtAuth.guard";
import { ConfigurationModule } from "modules/configuration/configuration.module";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule, ConfigService } from "nestjs-config";
import { AuthController } from "./adapters/in/auth.controller";
import { AccountRepository } from "./adapters/out/repositories/account.repository";
import { RoleRepository } from "./adapters/out/repositories/role.repository";
import { UserRepository } from "./adapters/out/repositories/user.repository";
import { UserSeService } from "./adapters/out/services/userSe.service";
import { UserModel } from "./entities/se/user.schema";
import { UserCreatedEventHandler } from "./events/userEvents";
import AuthenticationService from "./services/authentication.service";
import UserService from "./services/user.service";
import { BasicAuthStrategy } from "./strategies/basicAuth.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LoginCommandHandler } from "./useCases/login";
import { RegisterCommandHandler } from "./useCases/register";
import { ResendEmailVerificationCommandHandler } from "./useCases/resendEmailVerification";
import { VerifyEmailCommandHandler } from "./useCases/verifyEmail";

const commandHandlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
  VerifyEmailCommandHandler,
  ResendEmailVerificationCommandHandler,
];

const eventHandlers = [UserCreatedEventHandler];

const globalGuards = [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: EmailVerificationGuard,
  },
];

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get("auth.jwtPrivateKey"),
        signOptions: {
          expiresIn: config.get("auth.jwtExpiration"),
        },
      }),
      inject: [ConfigService],
    }),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
    ConfigurationModule,
    TypeOrmModule.forFeature([
      UserEntity,
      AccountEntity,
      ProviderEntity,
      AccountRoleEntity,
    ]),
    MongooseModule.forFeature([UserModel]),
  ],
  controllers: [AuthController],
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
      provide: "IAccountRepository",
      useClass: AccountRepository,
    },
    {
      provide: "IRoleRepository",
      useClass: RoleRepository,
    },
    {
      provide: "IAuthentication",
      useClass: AuthenticationService,
    },
    {
      provide: "IUserSeService",
      useClass: UserSeService,
    },
    BasicAuthStrategy,
    JwtStrategy,
    GoogleStrategy,
    ...commandHandlers,
    ...globalGuards,
    ...eventHandlers,
  ],
  exports: ["IUserService", JwtModule, "IUserRepository", "IUserSeService"],
})
export class AuthModule {}
