import { EngineScreen } from './modules/writing'
import { Universal } from './modules/interfaces'
//import { ContextMenu } from './modules/writing'
//import { NotificationServer } from './modules/writing'

declare global { var universal : Universal }

globalThis.universal = {
  editors : []
}

//const sleep = (ms : number) => new Promise(r => setTimeout(r, ms))

window.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main') as HTMLElement

  const engine = new EngineScreen( main )

  engine.create('You got me!')

})
