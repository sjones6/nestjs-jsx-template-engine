interface ParamFunc {
  (paramName: string): any
}

export declare namespace JSXTemplate {
  export interface RequestLocalsDecoration {
    path: string,
    method: string,
    ip: string,
    param: ParamFunc,
    params: object,
    query: object,
    protocol: 'http' | 'https',
    secure: boolean,
    url: string,
    originalUrl: string,
    body: any
  }
  export interface RenderProps {
    $req: RequestLocalsDecoration
  }
  export interface RenderFunc<T extends RenderProps> {
    (props: T): string
  }
}
