import { NotificationServer } from "./modules/NotificationServer"

Neutralino.init()

// #.
//Neutralino.events.on('ready', () => {
//
//  console.log('First load.')
//
//})

// #. To load files.
document.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main')

  if (!main) return console.error("Failed to find the '.main' HTMLElement in the body HTMLElement.")

  globalThis.notification_server = new NotificationServer(document.body)

  notification_server.create({ title: 'Mais um', level: 'low', text: 'This is the important part!'})

})
