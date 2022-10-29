import * as UI from '../../UI'

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

    const span = UI.generate('span')

    span.innerHTML = 'Welcome back, <b>monsieur</b>.'

    return span

  }

  export function main () : HTMLElement
  {

    const bg = UI.generate('section')
    bg.classList.add('bg', 'center-flex')

    bg.append(label())

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
