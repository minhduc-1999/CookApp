
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { RavenInterceptor } from 'nest-raven';
import { Public } from 'decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { NotRequireEmailVerification } from 'decorators/not_require_email_verification.decorator';

@UseInterceptors(new RavenInterceptor())
@Controller()
@ApiTags('Welcome to Tastify')
export class AppController {
  constructor(private readonly _appService: AppService) { }

  @Get()
  @Public()
  @NotRequireEmailVerification()
  getHello(): string {
    return this._appService.getHello();
  }

  // @Get('app/config')
  // getConfig() {
  //   const result = this._appService.getAppConfig();
  //   if (result.isError()) {
  //     return {
  //       meta: { ok: false, message: result.getErrorMessage() },
  //     };
  //   }
  //   return {
  //     meta: { ok: true },
  //     data: result.getData(),
  //   };
  // }
}
