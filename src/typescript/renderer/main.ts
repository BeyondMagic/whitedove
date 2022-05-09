declare const api : {
  threads : number
}


interface EventInput {
  target    : HTMLElement
  count     : boolean
  reset     : boolean
  event     : string
  eventType : string
}


//import { EngineScreen } from "./modules/writing"
class EngineScreen {

  container : HTMLElement

  constructor ( element : HTMLElement ) {

    this.container = element

  }

  // Count the amount of words given a screen content.
  count ( content : HTMLElement ) : void {

    const text : string = content.innerText!
    const information_container : Element = content!.parentElement!.querySelector('.information')!

    const word        : Element = information_container.querySelector('.word')!.firstElementChild!
    const characters  : Element = information_container.querySelector('.characters')!.firstElementChild!
    const sentences   : Element = information_container.querySelector('.sentences')!.firstElementChild!
    const paragraphs  : Element = information_container.querySelector('.paragraphs')!.firstElementChild!

    if (content.textContent?.length === 0) {

      paragraphs.textContent = sentences.textContent = word.textContent = characters.textContent = '0'

      return

    }

    const words     : Array<string> = text.split(' ')
    const lines     : Array<string> = text.match(/.$/gm)!
    const strophes  : Array<string> = text.match(/\.|,|.$|\)|\]/gm)!

    if (lines) paragraphs.textContent   = String(lines.length)
    if (strophes) sentences.textContent = String(strophes.length)

    word.textContent       = String(words.length)
    characters.textContent = String(text.length)

  }

  run ( input : EventInput ) : EventInput {

    if (input.count) {

      input.count = false
      this.count(input.target)

    }

    if (input.reset) {

      input.reset = false

      const selected = window.getSelection()?.anchorNode

      if (selected instanceof HTMLElement && selected.className.includes('text-container')) {

        document.execCommand( 'insertHTML', false, `<div><br></div>` )

      }

    }

    return input

  }

  create ( file : string ) : void {

    // 1. Load file content (HTML) into string.
    //console.log(file) // ...

    // 2. Create new element to write.
    this.container.insertAdjacentHTML( 'beforeend', '<main class="writing"></main>' )

    // 3. Get the element.
    const main = this.container.lastElementChild

    if (main instanceof HTMLElement) {

      // 5. Create edible content.
      main.insertAdjacentHTML( 'beforeend',
                              `<section spellcheck="false" class="text-container"><div><br></div></section>` )

      // 4. Add the label element.
      main.insertAdjacentHTML( 'beforeend',`<section class="label">${file}</section>` )

      // 4. Add the word counter element.
      main.insertAdjacentHTML( 'beforeend',
                              `<section class="information">
                                 <section class="word counter"><span>0</span>ワード</section>
                                 <section class="characters counter"><span>0</span>Characters</section>
                                 <section class="sentences counter"><span>0</span>Sentences</section>
                                 <section class="paragraphs counter"><span>0</span>Paragraphs</section>
                               </section>` )

      // 6. Get edible content element.
      const text_container = main.querySelector('.text-container')

      if (text_container instanceof HTMLElement) {

        // Where we'll verify some post-events.
        let input = {} as EventInput
        input.target = text_container
        input.count  = true

        // 7. Be able to focus on it.
        text_container.tabIndex = 0;

        // 8. Make it edible
        text_container.contentEditable = String(true)

        // Read all control.
        text_container.addEventListener( 'beforeinput' , async event => {

          if (event.target instanceof HTMLElement) {

            console.log(event)

            switch (event.inputType) {

              case 'historyRedo':
              case 'historyUndo':
              case 'insertFromDrop':
              case 'insertFromPaste':
              case 'deleteByCut':
              case 'deleteContentBackward':
              case 'deleteWordBackward':
              case 'insertText':

                input.count = true

                switch (event.inputType) {

                  // Add a new character with the rainbowish effect :)
                  case 'deleteWordBackward':
                  case 'deleteContentBackward':

                    if (event.target.children.length < 2 &&
                        event.target.firstElementChild?.textContent?.length === 0) {

                        input.reset = true

                    }

                    break

                }

              break

            }

          }

        })

        // Create new special binds such as (CTRL+>)
        text_container.addEventListener( 'keydown' , async event => {

          if (event.target instanceof HTMLElement) {

            switch (event.key) {

              case 'b':

                if (event.ctrlKey) {

                  //document.execCommand( 'insertHTML', false,
                  //                     '<customtag>' + window.getSelection() + '</customtag>')

                }

                break;

              case 'Tab':

                // Press tab at the start of a line will make it a paragraph.
                if (window.getSelection()?.anchorOffset === 0) {

                  window.getSelection()?.anchorNode?.parentElement?.classList.toggle('paragraph')

                  event.preventDefault()

                }

                break;

            }

          }

        })

        // Read after input.
        text_container.addEventListener( 'input' , async event => {

          if (event.target instanceof HTMLElement && event instanceof InputEvent) {

            switch (event.inputType) {

              case 'insertCompositionText':
              case 'historyUndo':
              case 'deleteByCut':
              case 'deleteContentBackward':
              case 'deleteWordBackward':

                if (event.target.children.length < 2 &&
                    !event.target.firstElementChild?.textContent) {

                  input.reset = true

                }

            }

            input = this.run(input)

          }

        })

        // In case the user clicks on the element.
        text_container.addEventListener( 'mousedown' , event => {

          if (event.target instanceof HTMLElement) {

            event.target.focus();

          }

        })

        // In case the element get focus, add a class to recognise it.
        text_container.addEventListener( 'focusin' , event => {

          if (event.target instanceof HTMLElement) {

            event.target.classList.add('active')
            event.target.classList.remove('inactive')

          }

        })

        // In case the element lose focus, add a class to recognise it.
        text_container.addEventListener( 'focusout' , event => {

          if (event.target instanceof HTMLElement) {

            event.target.classList.add('inactive')
            event.target.classList.remove('active')

          }

        })

        // 7. Focus on creation.
        text_container.focus();

        // TODO: Restore position of cursor.
        // ... Currently just go to the last character.
        {
          const selected = window.getSelection()!
          const selected_node = selected.anchorNode!
          selected.collapse(selected_node, selected_node.textContent!.length)
        }

        // Just run with the default settings (to count words, etc).
        input = this.run(input)

      }

    }

  }

  // Count all words of all files opened in 
  countAll () {

  }

  // Save the current content into a HTML file.
  save () {

  }

}

/*
 * The method we will use to start our page.
 */
window.addEventListener( 'DOMContentLoaded', () => {

  const main = document.body.querySelector('.main')

  if (main instanceof HTMLElement) {

    const engine = new EngineScreen( main );

    //engine.create(String(api.threads))
    engine.create('3. Book - 2. Chapter - 4. Episode')

    //notification.new( Notifications[colour_pick_joke] )

  }

});
