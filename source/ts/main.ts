import { NotificationServer } from './modules/NotificationServer'
import { PageSetter } from './modules/PageSetter'
//import { WhiteBoard } from './modules/WhiteBoard'

import icon_neutralino from'../icons/atom.svg'
import icon_settings from'../icons/settings.svg'

// #. Set initial defiinition of the system paths.
Neutralino.os.getPath('data').then( path => {

  globalThis.WhiteDove.system.data_path = path.concat('/whitedove/')

})

// #. Our 'ready' event of Neutralino.
.finally( async () => {

  // 1.
  globalThis.WhiteDove.pageSetter = new PageSetter()

  // 1.1.
  WhiteDove.pageSetter.parse_all()

  // 2. Define NotificationServer for global.
  globalThis.WhiteDove.notificationServer = new NotificationServer(document.body)

  // 2.1. Wait parsing of all Notifications from system.
  await WhiteDove.notificationServer.parse()

  // 3. White_board
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

    title : 'Eminem',
    level : 'urgent',
    text  : 'Nothing to <b>important</b>! I promise, こんにちは.',
    icon  : { element: WhiteDove.createIcon(icon_settings), name: 'neutralino' },

    buttons: [

      {
        name   : 'remove',
        level  : 'accept',
        action : () => {},
        icon   : WhiteDove.createIcon(icon_settings)
      }

    ]

  })

  //WhiteDove.notificationServer.backup()

})

{


}
