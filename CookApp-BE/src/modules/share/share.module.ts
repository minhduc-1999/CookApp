import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { DynamicModule, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { ThirdPartyProviders } from "enums/thirdPartyProvider.enum";
import { ConfigModule, ConfigService } from "nestjs-config";
import { join } from "path";
import { StorageController } from "./adapters/in/storage.controller";
import { MailService } from "./adapters/out/services/mail.service";
import { FirebaseStorageProvider } from "./adapters/out/services/provider.service";
import { FireBaseService } from "./adapters/out/services/storage.service";
import { GetUploadPresignedLinkQueryHandler } from "./useCases/getUploadPresignedLink";

export type StorageOptions = {
  provider: ThirdPartyProviders;
};

const handler = [GetUploadPresignedLinkQueryHandler];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService): Promise<MailerOptions> => {
        return {
          transport: {
            host: config.get("mail.host"),
            port: config.get("mail.port"),
            ignoreTLS: false,
            secure: false,
            auth: {
              user: config.get("mail.user"),
              pass: config.get("mail.password"),
            },
          },
          defaults: {
            from: config.get("mail.defaultFrom"),
          },
          template: {
            dir: join(__dirname, "templates", "mail"),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get("mail.emailVerificationSecret"),
        signOptions: {
          expiresIn: config.get("mail.emailVerificationCallbackExpiration"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StorageController],
  providers: [
    {
      provide: "IStorageService",
      useClass: FireBaseService,
    },
    {
      provide: "IMailService",
      useClass: MailService,
    },
    ...handler,
  ],
  exports: ["IStorageService", "IMailService"],
})
export class ShareModule {
  static register(options: { storage: StorageOptions }): DynamicModule {
    let storageClass: any
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
      exports: ["IStorageProvider"]
    };
  }
}
