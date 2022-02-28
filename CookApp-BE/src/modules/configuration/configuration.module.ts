import { Module } from "@nestjs/common";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { ConfigurationRepository } from "./adapters/out/repositories/configuration.repository";
import { ConfigurationService } from "./adapters/out/services/configuration.service";


const eventHandlers = [
];

const repositories = [
  {
    provide: "IConfigurationRepository",
    useClass: ConfigurationRepository
  }
];

const services = [
  {
    provide: "IConfigurationService",
    useClass: ConfigurationService
  }
];

@Module({
  imports: [
    ShareModule.register({
      storage: { provider: ThirdPartyProviders.FIREBASE },
    }),
    ConfigModule
  ],
  controllers: [],
  providers: [...eventHandlers, ...repositories, ...services],
  exports: ["IConfigurationService"],
})
export class ConfigurationModule {}
