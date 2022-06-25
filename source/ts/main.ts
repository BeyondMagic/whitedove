import { NotificationServer } from "./modules/NotificationServer"

Neutralino.init()

// #. Global.
{
  globalThis.sleep = (ms: number) : Promise<void> => {

    return new Promise( resolve => setTimeout(resolve, ms) )

  }

  globalThis.createIcon = (d : string, size : number = 48) : SVGSVGElement => {

    const xmlns = 'http://www.w3.org/2000/svg'

    const svg = document.createElementNS(xmlns, 'svg')
    {
      svg.setAttributeNS(null, 'viewBox', `0 0 ${size} ${size}`)
      svg.setAttributeNS(null, 'width', String(size))
      svg.setAttributeNS(null, 'height', String(size))

      const path = document.createElementNS(xmlns, 'path');
      {
        path.setAttributeNS(null, 'd', d)
        svg.appendChild(path)
      }
    }

    return svg

  }

  globalThis.icons = {

    close: 'M24 26.4 13.65 36.75q-.5.5-1.2.5t-1.2-.5q-.5-.5-.5-1.2t.5-1.2L21.6 24 11.25 13.65q-.5-.5-.5-1.2t.5-1.2q.5-.5 1.2-.5t1.2.5L24 21.6l10.35-10.35q.5-.5 1.2-.5t1.2.5q.5.5.5 1.2t-.5 1.2L26.4 24l10.35 10.35q.5.5.5 1.2t-.5 1.2q-.5.5-1.2.5t-1.2-.5Z',

  }
}

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

  const notification_server = new NotificationServer(document.body)

  notification_server.create({ title: 'Mais um', level: 'low', text: 'This is the important part!'})

  //notification_server.create({
  //  title: 'Writing',
  //  level: 'urgent',
  //  text: 'The writing of the file failed. Retry again?',
  //  buttons: [
  //    {
  //      level: 'accept',
  //      name: 'Retry.',
  //      action: () => notification_server.create({ title: 'Mais um', level: 'low', text: 'This is the important part!'}),
  //    },
  //    {
  //      level: 'dismiss',
  //      name: 'Nothing.',
  //      action: () => {},
  //    }

  //  ]
  //})

})
