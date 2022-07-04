import { TimeParser } from './modules/TimeParser'

Neutralino.init()

// #. WhiteDove sets.
globalThis.WhiteDove        = {} as any
globalThis.WhiteDove.system = {} as any

// #. WhiteDove.timeParser
globalThis.WhiteDove.timeParser = new TimeParser()

// #. WhiteDove.sleep
globalThis.WhiteDove.sleep = (ms: number) : Promise<void> => {

  return new Promise( resolve => setTimeout(resolve, ms) )

}

// #. WhiteDove.createIcon
globalThis.WhiteDove.createIcon = (data : string, size : number = 48) : SVGSVGElement | null => {

  const template = document.createElement('template')
  {
    data = data.trim()
    template.innerHTML = data
  }

  const svg = template.content.firstElementChild

  if (svg instanceof SVGSVGElement) {

    // #. For the style-sheet be able to change the width and height.
    if (!svg.getAttributeNS(null, 'viewBox')) {

      svg.setAttributeNS(null, 'viewBox', `0 0 ${size} ${size}`)

    }

    return svg

  } else {

    WhiteDove.notificationServer.create({
      title: 'create_icon',
      text: 'Unable to create the SVG element.',
      level: 'normal'})

    return null

  }

}
