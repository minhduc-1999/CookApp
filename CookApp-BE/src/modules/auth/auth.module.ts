import { HttpModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";
import { ConfigModule } from "nestjs-config";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    CqrsModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
