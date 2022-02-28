import { Module } from "@nestjs/common";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ShareModule } from "modules/share/share.module";
import { ConfigModule } from "nestjs-config";
import { ConfigurationService } from "./adapters/out/services/configuration.service";


const eventHandlers = [
];

const repositories = [
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
