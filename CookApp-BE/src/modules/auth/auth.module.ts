import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";
import { ConfigModule } from "nestjs-config";
import { AuthController } from "./adapters/in/auth.controller";
import { UserRepository } from "./adapters/out/repositories/user.repository";
import { UserModel } from "./domains/schemas/user.schema";
import AuthenticationService from "./services/authentication.service";
import UserService from "./services/user.service";
import { BasicAuthStrategy } from "./strategies/basicAuth.strategy";
import { RegisterCommandHandler } from "./useCases/register";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([UserModel]),
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    CqrsModule,
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
    RegisterCommandHandler,
    BasicAuthStrategy
  ],
})
export class AuthModule {}
