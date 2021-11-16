import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { RavenInterceptor } from 'nest-raven';
import { Public } from 'decorators/public.decorator';

@UseInterceptors(new RavenInterceptor())
@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) { }

  @Get()
  @Public()
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
