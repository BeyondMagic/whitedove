import { NotificationServer } from './modules/NotificationServer'
import { WhiteBoard } from './modules/WhiteBoard'

import icon_neutralino from'../icons/atom.svg'
import icon_settings from'../icons/settings.svg'

Neutralino.init()

Neutralino.events.on('ready', () => {

  notification_server.create({ 

    title : 'Neutralino',
    level : 'urgent',
    text  : 'Server is up running',
    icon  : { element: create_icon(icon_neutralino), name: 'neutralino' },

    buttons: [

      {
        name   : 'remove',
        level  : 'accept',
        action : () => {},
        icon   : create_icon(icon_settings)
      }

    ]

  })

})

// #. To load files.
document.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main')

  if (!(main instanceof HTMLElement)) {

    const error = "Failed to find the '.main' HTMLElement in the body HTMLElement."
    notification_server.create({ title: 'DOM', text: error, level: 'urgent'})
    return console.error(error)

  }

  globalThis.notification_server = new NotificationServer(document.body)
  globalThis.white_board         = new WhiteBoard(main)

  //white_board.create('/home/iris/story/#. Theater.json')

})
