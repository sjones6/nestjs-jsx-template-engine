import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JSXTemplate } from './interfaces/render';

@Injectable()
export class RenderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {

    // abort HTML rendering if response doesn't want html
    if (this.applyStrictAcceptHtmlCheck(req) && !req.accepts('html')) {
      return next();
    }

    const oRender = res.render.bind(res);
    const createDecoration = this.createLocalDecoration.bind(this, req, res);

    // apply overload to render method
    res.render = function (template: string | JSXTemplate.RenderFunc<any>, opt: any) {
      if (typeof template === 'string') {
        return oRender(template, opt);
      }
      try {
        res.send(
          template(
            opt,
            {
              ...this.app.locals || {},
              ...this.locals || {},
              ...createDecoration(),
            } as JSXTemplate.RenderProps
          )
        );
      } catch (err) {
        this.req.next(err);
      }
    }.bind(res);

    next();
  }
  
  private createLocalDecoration(req: Request, res: Response): JSXTemplate.RenderProps {
    return {
      ...this.decorateRenderProps(req, res),
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
      },
    }
  }

  /**
   * Override this method to change the middleware behavior
   */
  protected applyStrictAcceptHtmlCheck(req: Request): boolean {
    return true
  }

  /**
   * Override this method to apply additional decorations to the RenderProps
   */
  protected decorateRenderProps(req: Request, res: Response): object {
    return {}
  }

}
