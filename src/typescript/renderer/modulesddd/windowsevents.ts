//import { component } from './interfaces'

// Load all function modules for the UIEvent : resize and send all together into this.
[].forEach( component => {

  window.addEventListener( 'resize', event => component.send(event) 

})

