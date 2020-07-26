import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JSXTemplate } from './interfaces/render';

@Injectable()
export class RenderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const oRender = res.render.bind(res);
    const createDecoration = this.createLocalDecoration.bind(this, req, res);

    // apply overload to render method
    res.render = function(template, opt: any) {
      if (typeof template === 'string') {
        return oRender(template, opt);
      }
      try {
        res.send(template({
          ...this.app.locals || {},
          ...this.locals || {},
          ...createDecoration(),
          ...opt || {}
        }) as JSXTemplate.RenderFunc<JSXTemplate.RenderProps>);
      } catch (err) {
        this.req.next(err);
      }
    }.bind(res);

    next();
  }

  private createLocalDecoration(req: Request, res: Response): JSXTemplate.RenderProps {
    return {
      $req: {
        path: req.path,
        method: req.method,
        ip: req.ip,
        param: req.param.bind(req),
        params: req.params,
        query: req.query,
        protocol: req.protocol === 'https' ? 'https' : 'http',
        secure: req.secure,
        url: req.url,
        originalUrl: req.originalUrl,
        body: req.body
      }
    }
  }
}
