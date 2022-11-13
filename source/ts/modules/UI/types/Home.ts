import * as UI from '../../UI'
import * as System from '../../System'

namespace Background
{

  /* Will return a path to a local random wallpaper. */
  function get () : string
  {
    const list : Array<string> = [
      '/home/spirit/Library/Images/Wallpapers/TTC/Wallpaper (54).jpg',
      '/home/spirit/Library/Images/Wallpapers/black/reality/Wallpaper (37).jpg',
      '/home/spirit/Library/Images/Wallpapers/TTC/Wallpaper (262).jpg',
      '/home/spirit/Library/Images/Wallpapers/TTC/artistic-paint-texture-dark-blue-5k-a7.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/9as88a96eot61.png',
      '/home/spirit/Library/Images/Wallpapers/TTC/rfie9i4ijgo51.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/wallhaven-xlmlxv.png',
      '/home/spirit/Library/Images/Wallpapers/white/wallhaven-j3e17y.png',
      '/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-dp88ol.jpg',
      '/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-wqe2jr.png',
      '/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-2819q9.jpg',
      '/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-57yzj5.jpg',
      '/home/spirit/Library/Images/Wallpapers/TTC/wallhaven-z8pyxo.jpg',
      '/home/spirit/Library/Images/Wallpapers/realistic/dragons.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/plsknrs76pi91.png',
      '/home/spirit/Library/Images/Wallpapers/black/drawings/2mn8bo9krcx71.png',
      '/home/spirit/Library/Images/Wallpapers/black/l998udpehpw81.png',
      '/home/spirit/Library/Images/Wallpapers/black/9a4xhvvqqds91.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/obc2ffuv0bs91.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/1xigq8mrebs91.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/cgzeo8ztqga81.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/hlza0tarq0r91.png',
      '/home/spirit/Library/Images/Wallpapers/Gif/bpxxqqvps4h91.gif',
      '/home/spirit/Library/Images/Wallpapers/Gif/0k6meqvps4h91.gif',
      '/home/spirit/Library/Images/Wallpapers/Gif/x4hnwsvps4h91.gif',
      '/home/spirit/Library/Images/Wallpapers/Gif/uwwte8wps4h91.gif',
      '/home/spirit/Library/Images/Wallpapers/black/drawings/leno0nu4xeq91.jpg',
      '/home/spirit/Library/Images/Wallpapers/Gif/lhnvupvps4h91.gif',
      '/home/spirit/Library/Images/Wallpapers/wallpapers/qsh64css81o91.jpg',
      '/home/spirit/Library/Images/Wallpapers/wallpapers/general/qribyjgay3q91.png',
      '/home/spirit/Library/Images/Wallpapers/black/oy45n2tqvuq91.png',
      '/home/spirit/Library/Images/Wallpapers/Gif/1257951.jpeg',
      '/home/spirit/Library/Images/Wallpapers/black/5jbjguhhvel91.png',
      '/home/spirit/Library/Images/Wallpapers/black/vhyebxgvxzc91.jpg',
      '/home/spirit/Library/Images/Wallpapers/black/reality/fxt6m5gbrfv81.jpg',
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

  const bg = UI.generate('section')
  {
    bg.classList.add('bg')
    Background.invoke(bg)
  }

  const a = UI.generate('section')
  {

    a.classList.add('menu')

  }

  const b = UI.generate('section')
  {

    b.classList.add('main')

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
