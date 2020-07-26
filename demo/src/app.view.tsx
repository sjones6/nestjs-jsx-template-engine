import { h, JSXTemplate }  from 'nest-jsx-template-engine'

export interface IAppViewProps extends JSXTemplate.RenderProps {
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

export function App(props: IAppViewProps): string {
  return <html>
    <body>
      <h1 class="foo-class">{props.name}</h1>
      <div>
        Request path: {props.$req.path} from ip {props.$req.ip}
      </div>
      <Component name={props.name} />
      <div>
        <span onclick="alert('foo!')" style="text-decoration: underline">Alerts on Click!</span>
      </div>
      {null}
      {undefined}
      {function() { return 'stringified' }}
    </body>
  </html>
}