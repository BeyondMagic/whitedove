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
      plugin.container.setAttribute( 'data-persons',       '0' )
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

                  selection.collapse(element.childNodes[0], element.innerText.length - content.length)

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
          case 'insertText':     case 'insertCompositionText':

            this.editors[plugin.id].count = true

            switch (event.inputType) {

              case 'insertText': case 'insertCompositionText':

              break

            }

          break

        }

      })

      plugin.applet.addEventListener( 'input', async () => this.count(plugin) )
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

           parent.childNodes[0].textContent = text_to_cut
           plugin.applet.textContent = '.'
           plugin.applet.childNodes[0].textContent = cutted_text

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

  private async count ( plugin : PluginInterface ) : Promise<void> {

    {

      const text = plugin.applet.textContent

      if (!text || text.length === 0) {

        plugin.container.setAttribute( 'data-word',       '0' )
        plugin.container.setAttribute( 'data-characters', '0' )
        plugin.container.setAttribute( 'data-senteces',   '0' )
        plugin.container.setAttribute( 'data-paragraphs', '0' )
        plugin.container.setAttribute( 'data-persons',    '0' )

      } else if (text) {

        const words      : Array<string> = text.split(/\w /gm)
        const paragraphs : Array<string> = text.match(/.$/gm)!
        const sentences  : Array<string> = text.match(/\.|,|.$|\)|\]/gm)!

        plugin.container.setAttribute( 'data-word',       `${words.length}` )
        plugin.container.setAttribute( 'data-characters', `${text.length}` )
        plugin.container.setAttribute( 'data-senteces',   `${sentences.length}` )
        plugin.container.setAttribute( 'data-paragraphs', `${paragraphs.length}` )

      }

    }

    {
      this.editors[plugin.id].count = false

      let word_length       = 0
      let characters_lenght = 0
      let senteces_length   = 0
      let paragraphs_length = 0
      let persons_length    = 0

      this.editors[plugin.id].target.childNodes.forEach( item => {

        if (item instanceof HTMLElement) {

          word_length       += parseInt( item.getAttribute( 'data-word' )! )
          characters_lenght += parseInt( item.getAttribute( 'data-characters' )! )
          senteces_length   += parseInt( item.getAttribute( 'data-senteces' )! )
          paragraphs_length += parseInt( item.getAttribute( 'data-paragraphs' )! )
          persons_length    += parseInt( item.getAttribute( 'data-persons' )! )

        }

      })

      if (word_length     > 0 || characters_lenght > 0 ||
          senteces_length > 0 || paragraphs_length > 0 ||
          persons_length  > 0 ) {

        this.editors[plugin.id].information.classList.add('active')

      } else {

        this.editors[plugin.id].information.classList.remove('active')

      }

      this.editors[plugin.id].words      = word_length
      this.editors[plugin.id].characters = characters_lenght
      this.editors[plugin.id].sentences  = senteces_length
      this.editors[plugin.id].paragraphs = paragraphs_length
      this.editors[plugin.id].persons    = persons_length

      const word_element = this.editors[plugin.id].information.querySelector('.word')!.firstElementChild!
      const characters_element = this.editors[plugin.id].information.querySelector('.characters')!.firstElementChild!
      const sentences_element = this.editors[plugin.id].information.querySelector('.sentences')!.firstElementChild!
      const paragraphs_element = this.editors[plugin.id].information.querySelector('.paragraphs')!.firstElementChild!
      const persons_element = this.editors[plugin.id].information.querySelector('.persons')!.firstElementChild!

      word_element.textContent       = String(word_length)
      characters_element.textContent = String(characters_lenght)
      sentences_element.textContent  = String(senteces_length)
      paragraphs_element.textContent = String(paragraphs_length)
      persons_element.textContent    = String(persons_length)

    }

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
