import { NotificationServer } from './modules/NotificationServer'
import { WhiteBoard } from './modules/WhiteBoard'

Neutralino.init()

//Neutralino.events.on('ready', () => {
//
//  notification_server.create({ title: 'Neutralino', level: 'low', text: 'Server is up running 👍.'})
//
//})

// #. To load files.
document.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main')

  globalThis.notification_server = new NotificationServer(document.body)

  if (!(main instanceof HTMLElement)) {

    const error = "Failed to find the '.main' HTMLElement in the body HTMLElement."
    notification_server.create({ title: 'DOM', text: error, level: 'urgent'})
    return console.error(error)

  }

  globalThis.white_board         = new WhiteBoard(main)

  white_board.create('/home/iris/story/#. Theater.json')
 
})
