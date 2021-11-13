import { DynamicModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { StorageController } from "./adapters/in/storage.controller";
import { FirebaseStorageProvider } from "./adapters/out/services/provider.service";
import { FireBaseService } from "./adapters/out/services/storage.service";
import { GetUploadPresignedLinkQueryHandler } from "./useCases/getUploadPresignedLink";

export type StorageOptions = {
  provider: ThirdPartyProviders;
};

const handler = [GetUploadPresignedLinkQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [StorageController],
  providers: [
    {
      provide: "IStorageService",
      useClass: FireBaseService,
    },
    ...handler
  ],
  exports: ["IStorageService"],
})
export class ShareModule {
  static register(options: {storage: StorageOptions}): DynamicModule {
    let storageClass;
    switch (options.storage.provider) {
      case ThirdPartyProviders.FIREBASE:
        storageClass = FirebaseStorageProvider;
        break;
      default:
        storageClass = FirebaseStorageProvider;
        break;
    }
    return {
      module: ShareModule,
      providers: [
        {
          provide: "IStorageProvider",
          useClass: storageClass,
        },
      ],
    };
  }
}
