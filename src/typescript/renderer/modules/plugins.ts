import { PluginInterface, Universal } from './interfaces'

declare var universal : Universal

export class Plugins {

  paragraph ( init : PluginInterface ) {

    if (typeof init.data === 'string') {

      init.applet.innerText = init.data

    }

    init.applet.addEventListener( 'beforeinput', event => {

      switch (event.inputType) {

        case 'insertLineBreak':

          event.preventDefault()

          break

        case 'insertParagraph':
          //this.addPlugin({
          //                 type: 'Paragraph',
          //                 id: init.id,
          //                 focus: true,
          //                 after : init.container,
          //                 selection: document.getSelection()
          //              })
          event.preventDefault()

          break

      }

    })


  }

}
