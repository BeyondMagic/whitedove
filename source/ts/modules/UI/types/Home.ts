import * as UI from '../../UI'
import * as System from '../../System'

namespace Background
{

  function selector () : HTMLSelectElement
  {

    const changer = UI.generate('select')
    {

    }

    return changer

  }

  function label () : HTMLSpanElement
  {

    const [span, text] = [UI.generate('span'), UI.generate('span')]

    span.appendChild(text)
    text.innerHTML = 'Welcome back, <b>monsieur</b>.'

    return span

  }

  // TODO: Verify if image is better for cover, or just a blur zoom-in.
  async function invoke ( image : HTMLElement, bg : HTMLElement ) : Promise<void>
  {

    const path = '/home/spirit/Library/Images/Wallpapers/TTC/wall.png'

    const f = async () : Promise<Neutralino.os.ExecCommandResult> => Neutralino.os.execCommand(`rae ${path}`)

    const [colours, data] = await Promise.all( [f(), System.transform(path, 'image/jpg')])

    if (data)
    {
      const lines = colours.stdOut.split('\n')

      image.classList.add('ready')

      image.style.backgroundImage = `url("${data}")`
      bg.style.backgroundColor    = lines[0]
      bg.style.color              = lines[1]
    }

  }

  export function main () : HTMLElement
  {

    const bg = UI.generate('section')
    bg.classList.add('bg', 'center-flex')

    const text = label()

    bg.append(text)

    invoke(bg, text)

    return bg

  }

}

export function Init () : void
{

  document.body.classList.add('home')

  const a = UI.generate('section')
  const b = UI.generate('section')

  document.body.append(a, b, Background.main())

}
