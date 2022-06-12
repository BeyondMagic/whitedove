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

    {
      if ( plugin.type instanceof Function) {

        plugin.type(plugin)

      }
      this.#parameters.text(plugin)
      plugin.type = null

      plugin.applet.contentEditable = 'true'
      plugin.applet.tabIndex = 0
      plugin.applet.spellcheck = false

      plugin.applet.addEventListener( 'focusin', () => plugin.container.classList.add('active') )
      plugin.applet.addEventListener( 'focusout', () => plugin.container.classList.remove('active') )
    }

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
      plugin.container.classList.add('plugin')
      plugin.container.tabIndex = -1

      plugin.container.addEventListener( 'focusin',   () => plugin.aside.classList.add('active') )
      plugin.container.addEventListener( 'focusout',  () => plugin.aside.classList.remove('active') )
      plugin.container.addEventListener( 'mouseover', () => plugin.aside.classList.add('active') )
      plugin.container.addEventListener( 'mouseout',  () => {

        if (plugin.applet !== plugin.container.querySelector('div:focus-within'))
          plugin.aside.classList.remove('active')

      })


      plugin.container.appendChild(plugin.aside)
      plugin.container.appendChild(plugin.applet)
    }

    {

      if (plugin.after) {

        if (!plugin.where) plugin.where = 'afterend'

        plugin.after.insertAdjacentElement( plugin.where, plugin.container)

      } else {

        universal.editors[plugin.id].target.appendChild(plugin.container)

      }

      if (plugin.focus) {

        plugin.applet.focus()

      }
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
    }

    const settings = document.createElement('section')
    {
      settings.classList.add('settings')

      const minimise = document.createElement('span')
      minimise.classList.add('button', 'minimise')
      minimise.addEventListener( 'click', () => {

        text.classList.toggle('minimised') 

        if (minimise.textContent === '+') minimise.textContent = '-'
        else minimise.textContent = '+'

      })
      minimise.textContent = '-'

      settings.appendChild(minimise)
    }

    main.appendChild(settings)
    main.appendChild(text)

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
      input.settings    = settings
      input.container   = main
      input.target      = text
    }
    universal.editors.push(input)

    // Set events.
    {
      input.target.addEventListener( 'add', event => {

        const e = event as CustomEvent

        this.addPlugin( e.detail as PluginInit)

      })

      input.target.addEventListener( 'focusin',  async () => input.target.classList.add('active'))
      input.target.addEventListener( 'focusout', async () => input.target.classList.remove('active') )
    }

    // Add default plugins.
    {
      this.addPlugin( { type: this.#plugins.paragraph, id: input.id, focus: true } )
    }

  }

  public remove ( id : number ) : void {

    universal.editors.splice(id, 1)

  }

  public load ( id : EditorEventInput ) : void {

  }

}
