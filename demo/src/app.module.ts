import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RenderMiddleware } from 'nest-jsx-template-engine';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RenderMiddleware)
      .forRoutes('*');
  }
}
