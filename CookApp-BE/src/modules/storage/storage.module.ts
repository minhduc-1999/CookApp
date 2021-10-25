import { DynamicModule, Module } from "@nestjs/common";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { StorageController } from "./adapters/in/storage.controller";
import { FirebaseStorageProvider } from "./adapters/out/services/provider.service";
import { StorageService } from "./adapters/out/services/storage.service";

export type StorageOptions = {
  provider: ThirdPartyProviders;
};

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: "IStorageProvider",
      useClass: FirebaseStorageProvider,
    },
    {
      provide: "IStorageService",
      useClass: StorageService,
    },
  ],
})
export class StorageModule {
  static register(options: StorageOptions): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        {
          provide: "STORAGE_PROVIDER",
          useValue: options.provider,
        },
      ],
    };
  }
}
