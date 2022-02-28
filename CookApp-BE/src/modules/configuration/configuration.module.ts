import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { UserModule } from "modules/user/user.module";
import { HttpModule } from "@nestjs/axios";
import { ConfigurationRepository } from "./adapters/out/repositories/notification.repository";
import { ConfigurationService } from "./adapters/out/services/notification.service";

const eventHandlers = [
];

const repositories = [
  {
    provide: "IConfigurationRepository",
    class: ConfigurationRepository
  }
];

const services = [
  {
    provide: "IConfigurationService",
    class: ConfigurationService
  }
];

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([]),
    CqrsModule,
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [...eventHandlers, ...repositories, ...services],
  exports: ["IConfigurationService"],
})
export class ConfigurationModule {}
