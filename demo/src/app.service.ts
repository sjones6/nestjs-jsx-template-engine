import { Injectable } from '@nestjs/common';
import { IAppViewProps } from './app.view';

@Injectable()
export class AppService {
  getHello(): IAppViewProps {
    return { name: 'Hello World!' };
  }
}
