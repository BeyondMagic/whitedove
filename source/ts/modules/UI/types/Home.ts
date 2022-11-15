import * as UI from '../../UI'
import * as System from '../../System'
import svg_notebook from '../../../../icons/notebook.svg'
import svg_search from '../../../../icons/search.svg'

namespace Background
{

  /* Will return a path to a local random wallpaper. */
  function get () : string
  {
    const list : Array<string> = [
      //'/home/spirit/Library/Images/Wallpapers/TTC/Wallpaper (54).jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/reality/Wallpaper (37).jpg',
      //'/home/spirit/Library/Images/Wallpapers/TTC/Wallpaper (262).jpg',
      //'/home/spirit/Library/Images/Wallpapers/TTC/artistic-paint-texture-dark-blue-5k-a7.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/9as88a96eot61.png',
      //'/home/spirit/Library/Images/Wallpapers/TTC/rfie9i4ijgo51.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/wallhaven-xlmlxv.png',
      //'/home/spirit/Library/Images/Wallpapers/white/wallhaven-j3e17y.png',
      //'/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-dp88ol.jpg',
      //'/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-wqe2jr.png',
      //'/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-2819q9.jpg',
      //'/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-57yzj5.jpg',
      //'/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-z8pyxo.jpg',
      //'/home/spirit/Library/Images/Wallpapers/realistic/dragons.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/plsknrs76pi91.png',
      //'/home/spirit/Library/Images/Wallpapers/black/drawings/2mn8bo9krcx71.png',
      //'/home/spirit/Library/Images/Wallpapers/black/l998udpehpw81.png',
      //'/home/spirit/Library/Images/Wallpapers/black/9a4xhvvqqds91.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/obc2ffuv0bs91.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/1xigq8mrebs91.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/cgzeo8ztqga81.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/hlza0tarq0r91.png',
      //'/home/spirit/Library/Images/Wallpapers/Gif/bpxxqqvps4h91.gif',
      //'/home/spirit/Library/Images/Wallpapers/Gif/0k6meqvps4h91.gif',
      //'/home/spirit/Library/Images/Wallpapers/Gif/x4hnwsvps4h91.gif',
      //'/home/spirit/Library/Images/Wallpapers/Gif/uwwte8wps4h91.gif',
      //'/home/spirit/Library/Images/Wallpapers/black/drawings/leno0nu4xeq91.jpg',
      //'/home/spirit/Library/Images/Wallpapers/Gif/lhnvupvps4h91.gif',
      //'/home/spirit/Library/Images/Wallpapers/wallpapers/qsh64css81o91.jpg',
      //'/home/spirit/Library/Images/Wallpapers/wallpapers/general/qribyjgay3q91.png',
      //'/home/spirit/Library/Images/Wallpapers/black/oy45n2tqvuq91.png',
      //'/home/spirit/Library/Images/Wallpapers/Gif/1257951.jpeg',
      //'/home/spirit/Library/Images/Wallpapers/black/5jbjguhhvel91.png',
      //'/home/spirit/Library/Images/Wallpapers/black/vhyebxgvxzc91.jpg',
      //'/home/spirit/Library/Images/Wallpapers/black/reality/fxt6m5gbrfv81.jpg',
    ]

    return list[Math.floor( Math.random() * list.length)]

  }

  // TODO: Verify if image is better for cover, or just a blur zoom-in.
  /* Read image and apply to page its colour effect. */
  export async function invoke ( image : HTMLElement ) : Promise<void>
  {

    const path = get()

    const f = async () : Promise<Neutralino.os.ExecCommandResult> => Neutralino.os.execCommand(`rae "${path}"`)

    const [colours, data] = await Promise.all( [f(), System.transform(path)])

    if (data)
    {
      const lines = colours.stdOut.split('\n')

      image.classList.add('ready')

      image.style.backgroundImage = `url("${data}")`
      document.body.style.setProperty('--special-background', lines[0])
      document.body.style.setProperty('--special-colour', lines[1])
    }

  }

}

namespace Parade
{

  /* A minimum 100-letter quote to display. */
  export function label () : HTMLElement
  {

    const label = UI.generate('span')
    {
      label.classList.add('label')
      // TODO: Should come from quotes added by the creator.
      label.innerHTML = 'Welcome back, <b>monsieur</b>.'

    }

    return label
  }

}

export function Init () : void
{

  document.body.classList.add('home')

  const bg = UI.generate('section', 'bg')
  {
    Background.invoke(bg)
  }

  const a = UI.generate('section', 'menu')
  {

    const photo = UI.generate('span', 'photo')
    {
    }

    const buttons = UI.generate('div')
    {
      buttons.textContent = 'BBB'
    }

    a.append(photo)

  }

  const b = UI.generate('section', 'main')
  {

    const header = UI.generate('header')
    {

      const logo = UI.generate('section', 'logo', 'center-flex')
      {
        const notebook = UI.component.create.svg(svg_notebook, 48)

        logo.append(notebook)
      }

      const title = UI.generate('section', 'title')
      {
        const bold = UI.generate('h4', 'name')
        const info = UI.generate('div', 'info')

        bold.textContent  = 'Notebooks'
        info.textContent = 'Lines for future and past memories.' // Where anything is possible!

        title.append(bold, info)
      }

      const information = UI.generate('section', 'information', 'center-flex')
      {
        information.textContent = '19'

        const add = UI.generate('span', 'add')
        {
          add.textContent = '+'
        }

        information.append(add)
      }

      header.append(logo, title, information)
    }

    const bottom_bar = UI.generate('section', 'bottom_bar')
    {

      const bar = UI.generate('div', 'bar', 'center-flex')
      {
        const input = UI.component.create.input.search()

        input.focus()

        bar.append(input)
      }

      const search = UI.generate('div', 'search', 'center-flex')
      {
        const logo = UI.component.create.svg(svg_search, 48)

        search.append(logo)
      }

      bottom_bar.append(bar, search)

    }

    b.append(header, bottom_bar)
  }

  const c = UI.generate('section')
  {

    c.classList.add('parade') 

    const center = UI.generate('section')
    {
      center.classList.add('center', 'center-flex')
      center.append(Parade.label())
    }

    const status = UI.generate('section')
    {
      status.classList.add('status')

      /* How many words written today? */
      const words = UI.generate('span')
      {
        words.classList.add('words')

        // TODO: We should be able to change the label for the number, 'Eleven', '例’ or '〇’、'Um', 'Neux', etc.
        words.innerHTML = '<b>Zero</b> words written today!'
      }

      status.append(words)

    }

    c.append(center, status)

  }

  document.body.append(a, b, c, bg)

}
