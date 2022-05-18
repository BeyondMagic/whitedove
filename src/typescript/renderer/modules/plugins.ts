import { PluginInterface, PluginInit, Universal } from './interfaces'

declare var universal : Universal

export class Plugins {

  public paragraph ( init : PluginInterface ) {

    if (typeof init.data === 'string') {

      init.applet.innerText = init.data

    }

    init.applet.addEventListener( 'beforeinput', event => {

      switch (event.inputType) {

        case 'insertLineBreak':

          event.preventDefault()

          break

        case 'insertParagraph':

          const run = new CustomEvent( 'add', { detail: {

            type: new Plugins().paragraph,
            id: init.id,
            focus: true,
            after : init.container,

          } as PluginInit } )

          universal.editors[init.id].target.dispatchEvent(run)

          event.preventDefault()

          break

      }

    })

  }

}
