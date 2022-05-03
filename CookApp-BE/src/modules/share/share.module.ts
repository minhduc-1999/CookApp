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
import { DialogflowService } from "./adapters/out/services/nlp.service";
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
        const env = config.get("app.env")
        let auth: any;
        if (env === "development")
          auth = {}
        else {
          auth = {
            type: "oauth2",
            clientId: config.get("mail.clientId"),
            clientSecret: config.get("mail.clientSecret"),
            user: config.get("mail.user"),
            refreshToken: config.get("mail.refreshToken"),
            accessToken: config.get("mail.accessToken")
          }
        }
        return {
          transport: {
            host: config.get("mail.host"),
            port: config.get("mail.port"),
            ignoreTLS: false,
            secure: false,
            auth
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
    {
      provide: "INlpService",
      useClass: DialogflowService,
    },
    ...handler,
  ],
  exports: ["IStorageService", "IMailService", "INlpService"],
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
