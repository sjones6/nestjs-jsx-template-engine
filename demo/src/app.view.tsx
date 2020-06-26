import { h, JSX }  from 'nest-jsx-template-engine'
import { AppViewTransferObject } from './app.vto'

export function App(props: AppViewTransferObject): JSX.ElementClass {
  return <html>
    <body>
      <h1>{props.name}</h1>
    </body>
  </html>
}