globalThis.sleep = (ms: number) : Promise<void> => {

  return new Promise( resolve => setTimeout(resolve, ms) )

}

globalThis.create_icon = (data : string, size : number = 48) : SVGSVGElement | null => {

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

    notification_server.create({
      title: 'create_icon',
      text: 'Unable to create the SVG element.',
      level: 'normal'})

    return null

  }

}
