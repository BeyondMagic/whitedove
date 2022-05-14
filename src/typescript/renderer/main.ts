declare interface String {

  subRange(from : number, to : number) : string

}

const sleep = (ms : number) => new Promise(r => setTimeout(r, ms))

interface PluginInit {

  data?      : any
  focus?     : boolean
  after?     : HTMLElement
  type       : 'Paragraph' | 'Dialogue'
  id         : number
  selection? : Selection | null

}

interface PluginInterface extends PluginInit {

  applet     : HTMLDivElement
  container  : HTMLElement
  aside      : HTMLElement
  countable  : boolean
  where?     : 'beforeend' | 'beforebegin' | 'afterend' | 'afterbegin'

}

interface EditorEventInput {
  id         : number
  persons    : number
  paragraphs : number
  sentences  : number
  characters : number
  words      : number

  file       : string
  name       : string
  event      : string
  event_type : string

  count      : boolean

  container   : HTMLElement // .writing
  target      : HTMLElement // .text-container
  information : HTMLElement // .information
}

//import { EngineScreen } from "./modules/writing"
class EngineScreen {

  #container : HTMLElement
  editors    : Array<EditorEventInput>

  public constructor ( element : HTMLElement ) {

    this.#container = element
    this.editors    = []

  }

  private addPluginTextParameter ( plugin : PluginInterface ) : PluginInterface {

    {
      plugin.container.classList.add('text')
      plugin.applet.classList.add('content')
    }

    {
      plugin.container.setAttribute( 'data-word',          '0' )
      plugin.container.setAttribute( 'data-characters',    '0' )
      plugin.container.setAttribute( 'data-senteces',      '0' )
      plugin.container.setAttribute( 'data-paragraphs',    '0' )
      plugin.container.setAttribute( 'data-persons-cited', '0' )
    }

    {

      plugin.applet.addEventListener( 'keydown', async event => {

        const selection = document.getSelection()

        switch (event instanceof KeyboardEvent && event.key) {

          case 'Backspace':

            if (selection?.focusOffset === 0 &&
                this.editors[plugin.id].container.children[0] !== plugin.container) {

              const element = plugin.container.previousElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                const content = plugin.applet.innerText
                plugin.container.remove()
                element.innerText += content

                if (element.childNodes[0]) {

                  selection.collapse(element.childNodes[0], element.innerText.length)

                } else {

                  element.focus()

                }

                event.preventDefault()

              }

            }

          break

          case 'ArrowUp':

            if (selection?.focusOffset === 0) {

              const element = plugin.container.previousElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                if (element.childNodes[0]) {

                  selection.collapse(element.childNodes[0], element.innerText.length)

                } else {

                  element.focus()

                }
                event.preventDefault()

              }

            }

            break

          case 'ArrowDown':

            if (selection?.focusOffset === plugin.applet.innerText.length) {

              const element = plugin.container.nextElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                if (element.childNodes[0]) {

                  selection.collapse(element.childNodes[0], 0)

                } else {

                  element.focus()

                }

                event.preventDefault()

              }

            }

            break

        }


      })

      plugin.applet.addEventListener( 'beforeinput', async event => {

        switch (event instanceof InputEvent && event.inputType) {

          case 'historyRedo':    case 'historyUndo':
          case 'insertFromDrop': case 'insertFromPaste':
          case 'deleteByCut':    case 'deleteContentBackward': case 'deleteWordBackward':
          case 'insertText':

            this.editors[plugin.id].count = true

        }

      })

      plugin.applet.addEventListener( 'input', async () => this.count(plugin.id, plugin.applet) )
    }

    if (plugin.selection) {

      const current_applet = plugin.selection.anchorNode!
      const text           = current_applet?.textContent!
      const offset         = plugin.selection.anchorOffset
      const focus_offset   = plugin.selection.focusOffset
      const parent         = current_applet.parentElement!

      let text_to_cut = text
      let cutted_text = ''

      switch (plugin.selection.type) {

        case 'Caret':

         if (text.length === 0) {

           plugin.where = 'afterend'

         } else if (offset === 0) {

           plugin.where = 'beforebegin'

         } else {

           text_to_cut = text.substring(0, offset) + text.substring(text.length)
           cutted_text = text.substring(offset, text.length)

           parent.innerText        = text_to_cut
           plugin.applet.innerText = cutted_text

         }

        break

        case 'Range':

          text_to_cut = text.substring(0, focus_offset) + text.substring(offset)
          cutted_text = text.substring(offset, focus_offset)

          parent.innerText        = text_to_cut
          plugin.applet.innerText = cutted_text

          break

      }
    }

    return plugin

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

        this.addParagraph(plugin)
        plugin = this.addPluginTextParameter(plugin)

        break

      case 'Dialogue':

        break

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

        this.editors[plugin.id].target.appendChild(plugin.container)

      }

      if (plugin.focus) plugin.applet.focus()
    }

    return plugin

  }

  private addParagraph ( init : PluginInterface ) : void {

    if (typeof init.data === 'string') {

      init.applet.innerText = init.data

    }

    init.applet.addEventListener( 'beforeinput', event => {

      switch (event.inputType) {

        case 'insertLineBreak':

          event.preventDefault()

          break

        case 'insertParagraph':
          this.addPlugin({
                           type: 'Paragraph',
                           id: init.id,
                           focus: true,
                           after : init.container,
                           selection: document.getSelection()
                        })
          event.preventDefault()

          break

      }

    })
  }

  public async count ( id : number, target : HTMLDivElement ) : Promise<void> {

    this.editors[id].count = false
    //const text = target.innerText

    //const word       = this.editors[id].information.querySelector('.word')!.firstElementChild!
    //const characters = this.editors[id].information.querySelector('.characters')!.firstElementChild!
    //const sentences  = this.editors[id].information.querySelector('.sentences')!.firstElementChild!
    //const paragraphs = this.editors[id].information.querySelector('.paragraphs')!.firstElementChild!
    //const persons    = this.editors[id].information.querySelector('.persons')!.firstElementChild!

    //if (!text || text.length === 0) {

    //} else if (text) {

    //  const words     : Array<string> = text.split(/\w /gm)
    //  const lines     : Array<string> = text.match(/.$/gm)!
    //  const strophes  : Array<string> = text.match(/\.|,|.$|\)|\]/gm)!

    //  if (lines) paragraphs.textContent   = String(lines.length)
    //  if (strophes) sentences.textContent = String(strophes.length)

    //  word.textContent       = String(words.length)
    //  characters.textContent = String(text.length)

    //}

    //const text_elements = this.editors[id].target.querySelectorAll('.text')

    //this.editors[id].paragraphs = this.editors[id].sentences =
    //this.editors[id].words = this.editors[id].characters =
    //this.editors[id].persons = 0

    //if (text_elements.length) {

    //  paragraphs.textContent = sentences.textContent =
    //  word.textContent = characters.textContent =
    //  persons.textContent = '0'

    //} else {

    //  text_elements.forEach( element => {

    //    const paragraphs = parseInt( element.getAttribute('data-paragraphs')! )
    //    const sentences  = parseInt( element.getAttribute('data-senteces')! )

    //    if (paragraphs) this.editors[id].paragraphs += paragraphs
    //    if (paragraphs) this.editors[id].paragraphs += paragraphs

    //    this.editors[id].paragraphs +=  lines.length
    //    this.editors[id].sentences  += strophes.length
    //    this.editors[id].words      += words.length
    //    this.editors[id].characters += text.length
    //    this.editors[id].persons    += 0

    //  })

    //}

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
        counter.appendChild(digit)

        const content = document.createTextNode( item[0].toUpperCase() + item.substring(1) )
        counter.appendChild(content)

        information.appendChild(counter)

      })

      main.appendChild(information)
    }

    // Setting default values.
    {
      input.id          = this.editors.length
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
    this.editors.push(input)

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

    this.editors.splice(id, 1)

  }

  //public load ( id : EditorEventInput ) : void {

  //}

}

/*
 * The method we will use to start our page.
 */
window.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main')

  if ( !(main instanceof HTMLElement)) return;

  const engine = new EngineScreen( main )

  engine.create('3. Book - 2. Chapter - 4. Episode')

  //notification.new( Notifications[colour_pick_joke] )

})
