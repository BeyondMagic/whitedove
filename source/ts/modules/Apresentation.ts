import * as UI from './UI'

export namespace Animation
{

  export function background () : void
  {

    const canvas = UI.generate('canvas')

  }

}

function* steps ( index : number ) : Generator<void>
{

  document.body.dataset.step = String(index)

  switch (index++)
  {

    case 1:


      const header = UI.generate('header')
      header.classList.add('center-flex')
      {
        const label = UI.generate('h1')
        label.textContent = 'Welcome to WhiteDove'
        header.appendChild(label)
      }

      const footer = UI.generate('footer')
      {

      }

      document.body.append(header, footer)

    break

  }

}

export function start () : void
{

  document.body.classList.add('apresentation')

  {
    const iterator = steps(1);

    iterator.next()
  }

}
