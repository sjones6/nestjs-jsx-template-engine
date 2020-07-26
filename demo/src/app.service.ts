import { Injectable } from '@nestjs/common';
import { IAppViewProps } from './app.view';

@Injectable()
export class AppService {
  getHello(): Partial<IAppViewProps> {
    return { name: 'Hello World!' };
  }
}
