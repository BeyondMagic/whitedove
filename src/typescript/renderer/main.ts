const sleep = (ms : number) => new Promise(r => setTimeout(r, ms));

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

  target     : HTMLElement
  container  : HTMLElement
}

//import { EngineScreen } from "./modules/writing"
class EngineScreen {

  #container : HTMLElement
  editors    : Array<EditorEventInput>

  public constructor ( element : HTMLElement ) {

    this.#container = element
    this.editors     = []

  }

  // Count the amount of words given a screen content.
  public count ( content : HTMLElement, input : EditorEventInput ) : EditorEventInput {

    const text : string = content.innerText!
    const information_container : Element = content!.parentElement!.querySelector('.information')!

    const word        : Element = information_container.querySelector('.word')!.firstElementChild!
    const characters  : Element = information_container.querySelector('.characters')!.firstElementChild!
    const sentences   : Element = information_container.querySelector('.sentences')!.firstElementChild!
    const paragraphs  : Element = information_container.querySelector('.paragraphs')!.firstElementChild!
    const persons     : Element = information_container.querySelector('.persons')!.firstElementChild!

    if (content.textContent?.length === 0) {

      paragraphs.textContent = sentences.textContent = word.textContent = characters.textContent = persons.textContent = '0'
      input.paragraphs = input.sentences = input.words = input.characters = input.persons = 0

    } else {

      const words     : Array<string> = text.split(/\w /gm)
      const lines     : Array<string> = text.match(/.$/gm)!
      const strophes  : Array<string> = text.match(/\.|,|.$|\)|\]/gm)!

      if (lines) paragraphs.textContent   = String(lines.length)
      if (strophes) sentences.textContent = String(strophes.length)

      word.textContent       = String(words.length)
      characters.textContent = String(text.length)

      input.paragraphs = lines.length
      input.sentences  = strophes.length
      input.words      = words.length
      input.characters = text.length
      input.persons    = 0

    }

    return input

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
      text.tabIndex = 0
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

    input.id         = this.editors.length
    input.name       = 'New Episode'
    input.file       = input.name
    input.characters = 0
    input.words      = 0
    input.sentences  = 0
    input.paragraphs = 0
    input.persons    = 0
    input.container  = main
    input.target     = text

    this.editors.push(input)

    input.target.addEventListener( 'mousedown',   async () => input.target.focus() )
    input.target.addEventListener( 'focusin',     async () => input.target.classList.add('active'))
    input.target.addEventListener( 'focusout',    async () => input.target.classList.remove('active') )

    // 7. Focus on creation.
    input.container.focus()

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
