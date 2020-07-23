import { h }  from 'nest-jsx-template-engine'
import { AppViewTransferObject } from './app.vto'

function Component(props) {
  return <div>
    <h1>This is a component {props.name}</h1>
  </div>
}

export function App(props: AppViewTransferObject): string {
  return <html>
    <body>
      <h1 class="foo-class">{props.name}</h1>
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