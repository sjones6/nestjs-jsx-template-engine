import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RenderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    
    const oRender = res.render.bind(res);
    res.render = function(template, opt: any) {
      if (typeof template === 'string') {
        return oRender(template, opt);
      }
      try {
        res.send(template({ ...this.locals || {}, ...opt }));
      } catch (err) {
        this.req.next(err);
      }
    }.bind(res);

    next();
  }
}
