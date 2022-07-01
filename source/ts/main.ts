import { NotificationServer } from './modules/NotificationServer'
import { WhiteBoard } from './modules/WhiteBoard'

import icon_neutralino from'../icons/atom.svg'
import icon_settings from'../icons/settings.svg'

Neutralino.init()

Neutralino.os.getPath('data').then( path => {

  // #. system.data_path
  globalThis.system.data_path = path.concat('/whitedove/')

// #. Our 'ready' event of Neutralino.
}).finally( async () => {

  // #. notification_server
  globalThis.notification_server = new NotificationServer(document.body)
  await notification_server.parse()

  // #. white_board
  {
    const main = document.body.querySelector('.main')

    if (main instanceof HTMLElement) {

      globalThis.white_board = new WhiteBoard(main)

    } else {

      const error = "Failed to find the '.main' HTMLElement in the body HTMLElement."
      notification_server.create({ title: 'DOM', text: error, level: 'urgent'})
      console.error(error)

    }
  }

  //white_board.create('/home/iris/story/#. Theater.json')

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

  }, false)

  notification_server.backup()
  notification_server.page()

})
