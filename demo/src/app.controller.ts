import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Render } from 'nest-jsx-template-engine'
import { App } from './app.view';
import { AppViewTransferObject } from './app.vto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render(App)
  getHello(): AppViewTransferObject {
    return this.appService.getHello();
  }
}
