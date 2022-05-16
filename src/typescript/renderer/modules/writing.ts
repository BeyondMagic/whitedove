import { Universal, PluginInit, PluginInterface, EditorEventInput } from './interfaces'
import { PluginParameters } from './parameters'
import { Plugins } from './plugins'

declare var universal : Universal

//import { EngineScreen } from "./modules/writing"
export class EngineScreen {

  #container  : HTMLElement
  #plugins    : Plugins
  #parameters : PluginParameters

  public constructor ( element : HTMLElement ) {

    this.#container  = element
    this.#parameters = new PluginParameters()
    this.#plugins    = new Plugins()

  }

  private addPlugin ( init : PluginInit | PluginInterface ) : PluginInterface {

    let plugin = init as PluginInterface

    plugin.applet    = document.createElement('div')
    plugin.container = document.createElement('section')
    plugin.aside     = document.createElement('aside')

    plugin.container.classList.add('plugin')
    plugin.container.tabIndex = -1

    switch (plugin.type) {

      default:
      case 'Paragraph':

        this.#plugins.paragraph(plugin)
        plugin = this.#parameters.text(plugin)

        break

      case 'Dialogue':

        break

    }

    plugin.type = null

    {
      plugin.aside.classList.add('tools')

      const add = document.createElement('span')
      add.classList.add('button', 'add')
      add.textContent = '+'

      const format = document.createElement('span')
      format.classList.add('button', 'format')
      format.textContent = '::'

      plugin.aside.appendChild(add)
      plugin.aside.appendChild(format)

    }

    {
      plugin.container.addEventListener( 'focusin',   () => plugin.aside.classList.add('active') )
      plugin.container.addEventListener( 'focusout',  () => plugin.aside.classList.remove('active') )
      plugin.container.addEventListener( 'mouseover', () => plugin.aside.classList.add('active') )
      plugin.container.addEventListener( 'mouseout',  () => {

        if (plugin.applet !== plugin.container.querySelector('div:focus-within'))
          plugin.aside.classList.remove('active')

      })
    }

    plugin.container.appendChild(plugin.aside)
    plugin.container.appendChild(plugin.applet)

    plugin.applet.contentEditable = 'true'
    plugin.applet.tabIndex = 0

    {

      if (plugin.after) {

        if (!plugin.where) plugin.where = 'afterend'

        plugin.after.insertAdjacentElement( plugin.where, plugin.container)

      } else {

        universal.editors[plugin.id].target.appendChild(plugin.container)

      }

      if (plugin.focus) plugin.applet.focus()
    }

    return plugin

  }

  public create ( file : string , input = {} as EditorEventInput ) : void {

    // 1. Load file content (HTML) into string.
    console.log('File loaded:', file)

    const main = document.createElement('main')
    {
      main.classList.add('writing')
      this.#container.appendChild(main)
    }

    const text = document.createElement('section')
    {
      text.tabIndex = -1
      text.classList.add('text-container')
      main.appendChild(text)
    }

    const information = document.createElement('section')
    {
      information.classList.add('information')

      Array('word', 'characters', 'sentences', 'paragraphs', 'persons').forEach( item => {

        const counter = document.createElement('div')
        counter.classList.add('counter', item)

        const digit = document.createElement('span')
        digit.textContent = '0'

        const observer = new MutationObserver( mutations => {

          mutations.forEach( mutation => {

            if (mutation.target.textContent === '0') {

              mutation.target.parentElement?.classList.remove('active')

            } else {

              mutation.target.parentElement?.classList.add('active')

            }

          })

        })

        observer.observe(digit, { attributes: true, childList: true, characterData: true } )

        counter.appendChild(digit)

        const content = document.createTextNode( item[0].toUpperCase() + item.substring(1) )
        counter.appendChild(content)

        information.appendChild(counter)

      })

      main.appendChild(information)
    }

    // Setting default values.
    {
      input.id          = universal.editors.length
      input.name        = 'New Episode'
      input.file        = input.name
      input.characters  = 0
      input.words       = 0
      input.sentences   = 0
      input.paragraphs  = 0
      input.persons     = 0
      input.container   = main
      input.target      = text
      input.information = information
    }
    universal.editors.push(input)

    // Set events.
    {
      input.target.addEventListener( 'focusin',     async () => input.target.classList.add('active'))
      input.target.addEventListener( 'focusout',    async () => input.target.classList.remove('active') )
    }

    // Add default plugins.
    {
      this.addPlugin( { type: 'Paragraph', id: input.id, focus: true } )
    }

  }

  public remove ( id : number ) : void {

    universal.editors.splice(id, 1)

  }

  //public load ( id : EditorEventInput ) : void {

  //}

}
