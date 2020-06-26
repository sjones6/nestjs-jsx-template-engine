import { Injectable } from '@nestjs/common';
import { AppViewTransferObject } from './app.vto';

@Injectable()
export class AppService {
  getHello(): AppViewTransferObject {
    return { name: 'Hello World!' };
  }
}
