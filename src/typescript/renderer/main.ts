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
Components.forEach( component_decorator => {

  const component : Component = new component_decorator()

  universal.components[component.name] = component

  console.log(universal.components[component.name].name)

  /// Add the global events for the window of the component.
  component.events?.forEach( event => {

    window.addEventListener( event, () => component.send() )

  })

})
