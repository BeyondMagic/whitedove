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
        label.innerHTML = 'Welcome to <b>WhiteDove</b>'
        header.appendChild(label)
      }

      const footer = UI.generate('footer')
      {

        const section =
        { 
          icon        : UI.generate('section'),
          description : UI.generate('section'),
          buttons     : UI.generate('section')
        }

        section.icon.classList.add('icon', 'center-flex')
        {
          const icon = UI.generate('span')
          section.icon.appendChild(icon)
        }

        section.description.classList.add('description', 'center-flex')
        {

          const p = UI.generate('p')
          p.textContent = 'We have to set up a few things first for the application.'
          section.description.appendChild(p)

        }

        section.buttons.classList.add('buttons', 'center-flex')
        {

          const button = UI.generate('button')
          button.classList.add('neutral')
          button.textContent = 'Continue'
          section.buttons.appendChild(button)

        }

        footer.append(section.icon, section.description, section.buttons)

      }

      document.body.append(header, footer)

    break

  }

}

export function start () : void
{

  document.body.classList.add('apresentation')
  document.body.dataset.background = String(Math.floor( Math.random() * 2 ) + 1)

  {
    const iterator = steps(1);

    iterator.next()
  }

}
