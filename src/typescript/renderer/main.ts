// #.
//import { EngineScreen } from './modules/writing'
// #. C++ alike.
import { Universal, Component } from './interfaces'
// #. Where our global variable will be stored.
import { Global } from './global'
// #. All components that are going to be loaded.
import { default as Components } from './components_loader'

// #. Load global variable. To be acessed by other modules and components.
declare global { var universal : Universal }
globalThis.universal = Global

// #. Add each component from modules.
Components.forEach( component => {

  universal.components[component.name] = new component() as Component

  /// Add the global events for the window of the component.
  universal.components[component.name].events?.forEach( event => {

    window.addEventListener( event, () => universal.components[component.name].send() )

  })

})

// #. This will load other modules.
window.addEventListener( 'DOMContentLoaded', () => {

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
