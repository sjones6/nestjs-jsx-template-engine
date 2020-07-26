# nestjs-jsx-template-engine

This is a template engine for Nestjs applications that allows you to use JSX-based templates with strongly-typed params for server-side rendered HTML.

You don't need any extra templating engine like nunjucks or handlebars, and you get type-safety out of the box.

There's no additional compiler, since TypeScript compiles JSX natively.


> :warning: **WIP**: this package is still in progress and that API is _extremely_ volatile. Suggest not using in production.


## Installation

Install the package:

`npm install nest-jsx-template-engine`

Update your  `tsconfig.json` file to include `jsx` and `jsxFactory` options:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h"
  }
}
```

Install the middleware in your Nest `app.module`:

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RenderMiddleware } from 'nest-jsx-template-engine';
import { SomeModule } from './some/some.module';

@Module({
  imports: [SomeModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RenderMiddleware)
      .forRoutes('*');
  }
}
```

Suggest installing it globally for all routes, but see [Nest's](https://docs.nestjs.com/middleware#middleware) documentation for other options on installing the middleware.

> :warning: by default, the middleware will _not_ render the template for requests that do not expect HTML in the header (e.g., `Accept: 'text/html'`). It will merely return the value from the controller. You can modify this behavior by extending the middleware class.

## Rendering

```tsx
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Render } from 'nest-jsx-template-engine';
import { App, IAppProps } from './app.view';
import { AppViewTransferObject } from './app.vto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render<IAppProps>(App) // pass the App view directly to the Render decorator
  getHello(): IAppProps {
    return this.appService.getHello();
  }
}
```

Define your template with JSX:
```tsx
// app.view.tsx
import { h, JSXTemplate }  from 'nest-jsx-template-engine'

export interface IAppProps  {
  name: string
}

/**
 * @param {any} data the value returned from the controller
 * @param {JSXTemplate.RenderProps} props framework provided props containing request.
 * 
 * See below on extending the props passed
 */
export function App(data: IAppProps, props: JSXTemplate.RenderProps): string {
  return <html>
    <body>
      <h1 class="foo">{data.name}</h1>
      <div>Request Path: {props.$req.path} from ip: {props.$req.ip}
    </body>
  </html>
}
```

See a working demo in the Github repo.

## Extending Render behavior

The Render behavior provided by the middleware can be overriden in two key ways by sub-classing the middleware.

```typescript
import { RenderMiddleware, JSXTemplate } from 'next-jsx-template-engine';

export interface CustomRenderProps extends JSXTemplate.RenderProps {
  $foo: boolean
}

export class CustomRenderMiddleware {

  // by default, the middleware will not render requests that do not expect HTML in the response.
  // returning false will disable this check. You can do this variably by introspecting the req object
  applyStrictAcceptHtmlCheck(req: Request): boolean {

    // returning false means that the template will be rendered for all requests,
    // regardless of client's accept headers.
    return false;
  }

  // apply additional request/response specific properties that will be passed as
  // the second parameter to the JSX template along with the data returned from 
  // the controller. 
  // 
  // Common use-cases might be supplying session data, CSRF tokens, etc.
  decorateRenderProps(req: Request, res: Response): Partial<CustomRenderProps> {
    return {
      $foo: false
    }
  }
}
```

## A Note on React-Flavored JSX

This package does not support React flavored JSX (e.g., `className`, `htmlFor`, etc). It expects basic HTML properties.