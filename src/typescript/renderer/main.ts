interface EventInput {
  count:boolean
  target:HTMLElement
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

    if (input.count === true) {

      input.count = false;
      this.count(input.target);

    }

    return input

  }

  create ( file : string ) : void {

    // 1. Load file content (HTML) into string.
    console.log(file) // ...

    // 2. Create new element to write.
    this.container.insertAdjacentHTML( 'beforeend', '<main class="writing"></main>' )

    // 3. Get the element.
    const main = this.container.lastElementChild

    if (main instanceof HTMLElement) {

      // 4. Add the word counter element.
      main.insertAdjacentHTML( 'beforeend',
                              `<main class="information">
                                 <section class="word counter"><span>0</span>ワード</section>
                                 <section class="characters counter"><span>0</span>Characters</section>
                                 <section class="sentences counter"><span>0</span>Sentences</section>
                                 <section class="paragraphs counter"><span>0</span>Paragraphs</section>
                               </main>` )

      // 5. Create edible content.
      main.insertAdjacentHTML( 'beforeend',
                              `<section spellcheck="false" class="text-container"><div>First character.</div></section>` )

      // 6. Get edible content element.
      const text_container = main.querySelector('.text-container')

      if (text_container instanceof HTMLElement) {

        // Where we'll verify some post-events.
        let input = {} as EventInput
        input.target = text_container

        // 7. Be able to focus on it.
        text_container.tabIndex = 0;

        // 8. Make it edible
        text_container.contentEditable = String(true)

        // Read all control.
        text_container.addEventListener( 'beforeinput' , async event => {

          if (event.target instanceof HTMLElement) {

            // If press tab at the start of a line, insert a paragraph.
            console.log(event)

            switch (event.inputType) {

              case 'historyRedo':
              case 'historyUndo':
              case 'insertFromDrop':
              case 'insertFromPaste':
              case 'deleteByCut':
              case 'deleteContentBackward':
              case 'insertText':

                //console.log(window.getSelection())
                //var selected_node = sel.anchorNode
                //// selected_node is the text node
                //// that is inside the div
                //sel.collapse(selected_node, 3)
                input.count = true

              // case 'insertText'
              // Add a new character with the rainbowish effect :)

                //break

            }

          }

        })

        // Create new special binds such as (CTRL+>)
        text_container.addEventListener( 'keydown' , async event => {

          if (event.target instanceof HTMLElement) {

            console.log(event.key, event.shiftKey, event.ctrlKey)

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

          if (event.target instanceof HTMLElement) {

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

    // @ts-expect-error
    engine.create(api.threads)
    engine.create('lol')

    //notification.new( Notifications[colour_pick_joke] )

  }

});


// here we request our message and the event listener we added before,
//const config = JSON.parse(Electron.ipcRenderer.sendSync('synchronous-message', ''))
//
//// process our data however we want, in this example we print it on the browser console
//console.log(config)
