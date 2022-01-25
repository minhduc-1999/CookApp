import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { EmailVerificationGuard } from "guards/email_verification.guard";
import { JwtAuthGuard } from "guards/jwt_auth.guard";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule, ConfigService } from "nestjs-config";
import { AuthController } from "./adapters/in/auth.controller";
import { UserController } from "./adapters/in/user.controller";
import { UserRepository } from "./adapters/out/repositories/user.repository";
import AuthenticationService from "./services/authentication.service";
import UserService from "./services/user.service";
import { BasicAuthStrategy } from "./strategies/basicAuth.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GetProfileQueryHandler } from "./useCases/getProfile";
import { LoginCommandHandler } from "./useCases/login";
import { GoogleSignInCommandHandler } from "./useCases/loginWithGoogle";
import { RegisterCommandHandler } from "./useCases/register";
import { ResendEmailVerificationCommandHandler } from "./useCases/resendEmailVerification";
import { UpdateProfileCommandHandler } from "./useCases/updateProfile";
import { VerifyEmailCommandHandler } from "./useCases/verifyEmail";

const handlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
  UpdateProfileCommandHandler,
  GetProfileQueryHandler,
  GoogleSignInCommandHandler,
  VerifyEmailCommandHandler,
  ResendEmailVerificationCommandHandler,
];

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
    BasicAuthStrategy,
    JwtStrategy,
    ...handlers,
    ...globalGuards,
  ],
  exports: ["IUserService"],
})
export class AuthModule { }
