import { NotificationServer } from "./modules/NotificationServer"
import { WhiteBoard } from "./modules/WhiteBoard"

Neutralino.init()

Neutralino.events.on('ready', () => {

  notification_server.create({ title: 'Neutralino', level: 'low', text: 'Server is up running 👍.'})

})

// #. To load files.
document.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main')

  if (!(main instanceof HTMLElement)) return console.error("Failed to find the '.main' HTMLElement in the body HTMLElement.")

  globalThis.notification_server = new NotificationServer(document.body)
  globalThis.white_board         = new WhiteBoard(main)

  white_board.create('/home/iris/story.json')
 
})
