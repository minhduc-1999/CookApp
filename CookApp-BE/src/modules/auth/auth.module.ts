import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import "dotenv/config";
import { ConfigModule } from "nestjs-config";
import { AuthController } from "./adapters/in/auth.controller";
import { UserModel } from "./domains/schemas/user.schema";

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
  providers: [],
})
export class AuthModule {}
