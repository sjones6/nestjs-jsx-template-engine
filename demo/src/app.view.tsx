import { h, JSXTemplate }  from 'nest-jsx-template-engine'

export interface IAppViewProps {
  name: string
}

interface ComponentProps {
  name: string
}

function Component(props: ComponentProps) {
  return <div>
    <h1>This is a component {props.name}</h1>
  </div>
}

export function App(data: IAppViewProps, props: JSXTemplate.RenderProps): string {
  return <html>
    <body>
      <h1 class="foo-class">{data.name}</h1>
      <div>
        Request path: {props.$req.path} from ip {props.$req.ip}
      </div>
      <Component name={data.name} />
      <div>
        <span onclick="alert('foo!')" style="text-decoration: underline">Alerts on Click!</span>
      </div>
      {null}
      {undefined}
      {function() { return 'stringified' }}
    </body>
  </html>
}