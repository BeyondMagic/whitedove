//import { EngineScreen } from "./modules/writing"
class EngineScreen {

  container : HTMLElement

  constructor ( element : HTMLElement ) {

    this.container = element

  }

  // Count the amount of words given a screen content.
  count ( content : HTMLElement ) {

    if (content.textContent) {

      const length = content.textContent.split(' ').length;

      content!.parentElement!.firstElementChild!.firstElementChild!.textContent = length.toString();

    }

  }

  async create ( file : string ) : Promise<void> {

    // 1. Load file content (HTML) into string.
    console.log(file) // ...

    // 2. Create new element to write.
    this.container.insertAdjacentHTML( 'beforeend', '<main class="writing"></main>' )

    // 3. Get the element.
    const main = this.container.lastElementChild

    if (main instanceof HTMLElement) {

      // 4. Add the word counter element.
      main.insertAdjacentHTML( 'beforeend', '<section class="word-counter"><span>0</span><span>ワード</section>' )

      // 5. Create edible content.
      main.insertAdjacentHTML( 'beforeend', `<section class="text-container"><div>${file}</div></section>` )

      // 6. Get edible content element.
      const text_container = main.querySelector('.text-container')

      if (text_container instanceof HTMLElement) {

        // 7. Be able to focus on it.
        text_container.tabIndex = 0;

        // 8. Make it edible
        text_container.contentEditable = "true"

        // Read all control.
        text_container.addEventListener( 'beforeinput' , event => {

          console.log(event)

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

        // In case the element lose focus, add a class to recognise it.
        text_container.addEventListener( 'keydown' , event => {

          if (event.target instanceof HTMLElement) {

            const text = event.target.textContent;

            if (!text) {
              console.log('dawdawd')
              return this.count(event.target);
            }

            if (event.target instanceof HTMLElement) {

              switch (event.key) {

                case 'a':

                  // CTRL+A : Select all content.
                  if (event.ctrlKey) {

                    console.log('ahahha')
                    event.target.setAttribute( 'data-selected-all', 'true' )

                  }

                // In case of adding a space see if the target is a space to reload the word count.
                case ' ':

                  this.count(event.target)

                  break;

                // Delete a character, see if the target is a space to reload the word count.
                case 'Backspace':

                    if (text.charAt(text.length - 1) === ' ') {

                      this.count(event.target)

                    }

                  break;

              }

            }

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

    //notification.new( Notifications[colour_pick_joke] )

  }

});


// here we request our message and the event listener we added before,
//const config = JSON.parse(Electron.ipcRenderer.sendSync('synchronous-message', ''))
//
//// process our data however we want, in this example we print it on the browser console
//console.log(config)
