import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { renderToString } from 'react-dom/server'

@Injectable()
export class RenderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    
    const oRender = res.render.bind(res);
    res.render = function(template, opt: any) {
      if (typeof template === 'string') {
        return oRender(template, opt);
      }
      try {
        const str = renderToString(template({ ...this.locals || {}, ...opt }));
        res.send(str);
      } catch (err) {
        this.req.next(err);
      }
    }.bind(res);

    next();
  }
}
