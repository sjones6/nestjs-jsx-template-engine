import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Render } from 'nest-jsx-template-engine'
import { App, IAppViewProps } from './app.view';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render<IAppViewProps>(App)
  getHello(): IAppViewProps {
    return this.appService.getHello();
  }
}
