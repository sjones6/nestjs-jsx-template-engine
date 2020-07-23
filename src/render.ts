import 'reflect-metadata';
import { RENDER_METADATA } from '@nestjs/common/constants';

/**
 * Route handler method Decorator.  Defines a template to be rendered by the controller.
 *
 * For example: `@Render(TemplateFunc)`
 *
 * @param template JSX component to render
 *
 * @publicApi
 */
export function Render(template: (props: any) => string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    Reflect.defineMetadata(RENDER_METADATA, template, descriptor.value);
    return descriptor;
  };
}