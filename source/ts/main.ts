import { NotificationServer } from './modules/NotificationServer'
import { PageSetter } from './modules/PageSetter'
//import { WhiteBoard } from './modules/WhiteBoard'

import icon_neutralino from'../icons/atom.svg'
import icon_settings from'../icons/settings.svg'

Neutralino.os.getPath('data').then( path => {

  globalThis.WhiteDove.system.data_path = path.concat('/whitedove/')

})

// #. Our 'ready' event of Neutralino.
.finally( async () => {

  // 1. Define NotificationServer for global.
  globalThis.WhiteDove.notificationServer = new NotificationServer(document.body)

  // 1.1. Wait parsing of all Notifications from system.
  await WhiteDove.notificationServer.parse()

  // #. white_board
  //{
  //  const main = document.body.querySelector('.main')

  //  if (main instanceof HTMLElement) {

  //    globalThis.WhiteDove.whiteBoard = new WhiteBoard(main)

  //  } else {

  //    const error = "Failed to find the '.main' HTMLElement in the body HTMLElement."
  //    WhiteDove.notificationServer.create({ title: 'DOM', text: error, level: 'urgent'})
  //    console.error(error)

  //  }
  //}

  //WhiteDove.whiteBoard.create('/home/iris/story/#. Theater.json')

  WhiteDove.notificationServer.create({

    title : 'Neutralino',
    level : 'urgent',
    text  : 'Server is up running',
    icon  : { element: WhiteDove.createIcon(icon_neutralino), name: 'neutralino' },

    buttons: [

      {
        name   : 'remove',
        level  : 'accept',
        action : () => {},
        icon   : WhiteDove.createIcon(icon_settings)
      }

    ]

  }, false)

  //WhiteDove.notificationServer.backup()
  WhiteDove.notificationServer.show_sidebar()

})

{
  const pageSetter = new PageSetter()

  pageSetter.parse_all()

}
