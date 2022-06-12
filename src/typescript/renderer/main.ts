//import { EngineScreen } from './modules/writing'
import { Universal, Component } from './interfaces'
import { Global } from './global'
//import { ContextMenu } from './modules/writing'
//import { NotificationServer } from './modules/writing'
//import { WindowsEvents } from './modules/windowsevents'
import { default as Components } from './modules'

// Load central information
declare global { var universal : Universal }
globalThis.universal = Global

// Load modules/components.
window.addEventListener( 'DOMContentLoaded', () => {

  Components.forEach( constructor => {

    const component = new constructor.component() as Component

    universal.components[component.name] = component

    console.log(universal.components)

  })

  //const main = document.body.querySelector('.main') as HTMLElement

  //{
  //  const engine = new EngineScreen( main )

  //  engine.create('You got me!')
  //  engine.create('You gdwd')
  //}

  //// Setup cursor.
  //{

  //}

})
