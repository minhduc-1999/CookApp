import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, JwtService } from "@nestjs/jwt";
import "dotenv/config";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { EmailVerificationGuard } from "guards/emailVerification.guard";
import { JwtAuthGuard } from "guards/jwtAuth.guard";
import { ConfigurationModule } from "modules/configuration/configuration.module";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule, ConfigService } from "nestjs-config";
import { AuthController } from "./adapters/in/auth.controller";
import { UserRepository } from "./adapters/out/repositories/user.repository";
import AuthenticationService from "./services/authentication.service";
import UserService from "./services/user.service";
import { BasicAuthStrategy } from "./strategies/basicAuth.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LoginCommandHandler } from "./useCases/login";
import { GoogleSignInCommandHandler } from "./useCases/loginWithGoogle";
import { RegisterCommandHandler } from "./useCases/register";
import { ResendEmailVerificationCommandHandler } from "./useCases/resendEmailVerification";
import { VerifyEmailCommandHandler } from "./useCases/verifyEmail";

const handlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
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
    ConfigurationModule
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
      provide: "IAuthentication",
      useClass: AuthenticationService,
    },
    BasicAuthStrategy,
    JwtStrategy,
    ...handlers,
    ...globalGuards,
  ],
  exports: ["IUserService", JwtModule],
})
export class AuthModule { }
