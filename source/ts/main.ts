import { NotificationServer } from './modules/NotificationServer'
import { PageSetter } from './modules/PageSetter'
import { ToolTip } from './modules/ToolTip'
//import { WhiteBoard } from './modules/WhiteBoard'

//import icon_neutralino from'../icons/atom.svg'
import icon_settings from'../icons/settings.svg'

// #. Set initial defiinition of the system paths.
Neutralino.os.getPath('data').then( path => {

  globalThis.WhiteDove.system.data_path = path.concat('/whitedove/')

})

// #. Our 'ready' event of Neutralino.
.finally( async () => {

  // 1. Set initial components.
  {
    // 1.3. ToolTip - Little information.
    globalThis.WhiteDove.toolTip = new ToolTip()

    // 1.1. PageSetter - Page loading, elements, and design.
    globalThis.WhiteDove.pageSetter = new PageSetter()
    WhiteDove.pageSetter.parse_all()

    // 1.2. NotificationServer - Main notifications.
    globalThis.WhiteDove.notificationServer = new NotificationServer(document.body)
    // 1.2.1. Wait parsing of all Notifications from system.
    await WhiteDove.notificationServer.parse()

  }

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
