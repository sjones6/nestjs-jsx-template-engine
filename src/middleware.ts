import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JSXTemplate } from './interfaces/render';

@Injectable()
export class RenderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {

    const applyStrictAcceptHtmlCheck = this.applyStrictAcceptHtmlCheck(req);
    const oRender = res.render.bind(res);
    const createDecoration = this.createLocalDecoration.bind(this, req, res);

    // apply overload to render method
    res.render = function (template: string | JSXTemplate.RenderFunc<any>, opt: any) {

      // apply strict header checks: effect is that it will return
      // either plain text response for strings returned from a controller
      // or JSON from an object.
      if (applyStrictAcceptHtmlCheck && !req.accepts('html')) {
        if (typeof opt === 'string') {
          return res.send(opt);
        } else {
          return res.json(opt);
        }
      }

      // fallback to default express behavior- the template isn't a JSX function
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
