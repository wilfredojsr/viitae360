import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth, AuthType } from '@commons/decorators/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth(AuthType.None)
  @Get()
  health(): json {
    return this.appService.healthCheck();
  }
}
