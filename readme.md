# nestjs-jsx-template-engine

This is a template engine for Nestjs applications that allows you to use JSX-based templates with strongly-typed params for server-side rendered HTML.

You don't need any extra templating engine like nunjucks or handlebars, and you get type-safety out of the box.

There's no additional compiler, since TypeScript compiles JSX natively.

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
  getHello(): Partial<IAppProps> {
    return this.appService.getHello();
  }
}
```

Define your template with JSX:
```tsx
// app.view.tsx
import { h, JSXTemplate }  from 'nest-jsx-template-engine'
import { AppViewTransferObject } from './app.vto'

export interface IAppProps extends JSXTemplate.RenderProps {
  name: string
}

export function App(props: IAppProps): string {
  return <html>
    <body>
      <h1 class="foo">{props.name}</h1>
      <div>Request Path: {props.$req.path} from ip: {props.$req.ip}
    </body>
  </html>
}
```

See a working demo in the Github repo.

## A Note on React-Flavored JSX

This package does not support React flavored JSX (e.g., `className`, `htmlFor`, etc). It expects basic HTML properties.