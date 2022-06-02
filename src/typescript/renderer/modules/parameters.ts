import { PluginInterface, Universal } from './interfaces'

declare var universal : Universal

export class PluginParameters {

  public text ( plugin : PluginInterface ) : PluginInterface {

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

        // Inserting a letter so fast the cursor actually doesn't update! So remove the transition.
        if (event.repeat) {

          universal.cursor_focus.style.transitionDuration = '0ms'

        // Restore the state of the cursor transtion duration.
        } else {

          universal.cursor_focus.style.transitionDuration = '100ms'

        }

        // TODO: Find a less repetive way to declare this as KeyboardEvent in TS.
        switch (event instanceof KeyboardEvent && event.key) {

          case 'a':

            // Simulate, select everything!
            if (event.ctrlKey) {

              const range = document.createRange()

              // Can't select nothing!
              if (plugin.applet.children.length !== 0) {

                range.setStart(plugin.applet.firstElementChild!, 0)
                range.setEnd(plugin.applet.lastElementChild!, 1)

                universal.selection.removeAllRanges()
                universal.selection.addRange(range)

                Array.from(plugin.applet.children).forEach( item => item.classList.add('selected') )

                universal.updateCursor()

              }

              event.preventDefault()

            }

          break

          case 'Escape':

            plugin.applet.querySelectorAll('.new').forEach( element => element.classList.remove('new') )

          break

          case 'Backspace':

            // Remove all selected elements.
            plugin.applet.querySelectorAll('.selected').forEach( item => item.remove() )

            // If it's at the start of the content.
            if (universal.selection.focusOffset === 0 &&
                universal.editors[plugin.id].container.children[0] !== plugin.container) {

              // Select previous text plugin.
              const element = plugin.container.previousElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                universal.selection.collapse(element.lastElementChild, 1)

                // Just update the content.
                {
                  universal.updateCursor()
                  plugin.container.remove()
                  event.preventDefault()
                }

              }

            }

          break

          case 'ArrowUp':

            if (universal.selection.focusOffset === 0) {

              const element = plugin.container.previousElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                if (element.lastElementChild) {

                  universal.selection.collapse(element.lastElementChild, 1)

                } else {

                  element.focus()

                }

                event.preventDefault()

              }

            }

            universal.updateCursor()

          break

          case 'ArrowDown':

            if (universal.selection.focusOffset === plugin.applet.innerText.length) {

              const element = plugin.container.nextElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                if (element.firstElementChild) {

                  universal.selection.collapse(element.firstElementChild, 0)

                } else {

                  element.focus()

                }

                event.preventDefault()

              }

            }

            universal.updateCursor()

          break

        }


      })

      plugin.applet.addEventListener( 'keyup', async event => {

        const current_character = universal.selection.anchorNode?.parentElement!

        switch (event instanceof KeyboardEvent && event.key) {

          case 'Home':

            if (current_character === plugin.applet.firstElementChild) {

              universal.selection.collapse(current_character, 0)

            } else if (current_character.nextElementSibling instanceof HTMLSpanElement) {

              universal.selection.collapse(current_character.nextElementSibling, 0)

            }

            universal.updateCursor()

            event.preventDefault()

          break

          case 'End':

            if (current_character === plugin.applet.lastElementChild) {

              universal.selection.collapse(current_character, 1)

            } else if (current_character instanceof HTMLSpanElement) {

              universal.selection.collapse(current_character, 0)

            }

            universal.updateCursor()

            event.preventDefault()

          break

          case 'ArrowRight':
          case 'ArrowLeft':

            if (current_character instanceof HTMLSpanElement) {

              if (universal.selection.type === 'Caret') {

                universal.selection.collapse(current_character, universal.selection.focusOffset)

              // Obviously for Range.
              } else {

                const range = document.createRange()

                // Select behind: 0, 1.
                if (universal.selection.focusOffset === 0 && universal.selection.anchorOffset === 1) {

                  range.setStart(universal.selection.focusNode!.parentElement!, universal.selection.focusOffset)
                  range.setEnd(universal.selection.anchorNode!.parentElement!, universal.selection.anchorOffset)

                // Select front: 1, 0.
                } else if (universal.selection.focusOffset === 1 && universal.selection.anchorOffset === 0) {

                  range.setStart(universal.selection.anchorNode!.parentElement!, universal.selection.anchorOffset)
                  range.setEnd(universal.selection.focusNode!.parentElement!, universal.selection.focusOffset)

                }

                universal.selection.removeAllRanges()
                universal.selection.addRange(range)

                console.log(universal.selection)

              }

              // Just update the central events.
              {
                universal.updateCursor(event.repeat)
                event.preventDefault()
              }

            }

          break

          case 'ArrowDown':
          case 'ArrowUp':

            if (current_character === plugin.applet.firstElementChild) {

              universal.selection.collapse(current_character, 0)

            } else {

              universal.selection.collapse(current_character, 1)

            }

            // Just update the central events.
            {
              universal.updateCursor()
              event.preventDefault()
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

            universal.editors[plugin.id].count = true

            switch (event.inputType) {

              case 'deleteContentBackward':

                if (universal.selection.anchorNode instanceof HTMLElement) {

                  const character_to_remove = universal.selection.anchorNode
                  const previous_character  = character_to_remove.previousElementSibling

                  // If it's after the character.
                  if (character_to_remove instanceof HTMLSpanElement &&
                      universal.selection.focusOffset === 1) {

                    character_to_remove.remove()

                  }

                  if (previous_character instanceof HTMLSpanElement) {

                    universal.selection.collapse(previous_character, 1)

                  }

                  {
                    universal.updateCursor()
                    event.preventDefault()
                  }

                }

              break

              case 'insertText':

                const range     = universal.selection.getRangeAt(0)

                const new_character = document.createElement('span')
                new_character.classList.add('character', 'new')
                new_character.textContent = event.data

                const commonAncestor = range.commonAncestorContainer

                // In case there is not a single character on the content.
                if (commonAncestor instanceof HTMLElement &&
                    commonAncestor.classList.contains('content')) {

                  range.insertNode(new_character)

                // In case there is already a character.
                } else if (commonAncestor instanceof HTMLSpanElement) {

                  // Verify if it should inserted after or before.
                  switch (universal.selection.focusOffset) {

                    // To insert before.
                    case 0: commonAncestor.insertAdjacentElement( 'beforebegin' , new_character); break;

                    // To insert after.
                    case 1: commonAncestor.insertAdjacentElement( 'afterend'    , new_character); break;

                  }

                }

                // In case the character was deleted before we could focus on it.
                if (new_character.textContent?.length !== 0) {

                  universal.selection.collapse(new_character, 1)

                }

                // Update main events for the input.
                {
                  universal.updateCursor()
                  plugin.applet.dispatchEvent( new Event('input'))
                  event.preventDefault()
                }

              break

            }

          break

        }

      })

      plugin.applet.addEventListener( 'input', async () => {

        this.count(plugin)

      })

      plugin.applet.addEventListener( 'paste', async event => {

        event.preventDefault()

        const text = event.clipboardData?.getData('text/plain')
        if (text) {

          const current_text = plugin.applet.innerHTML
          const to_move = universal.selection.focusOffset + text.length

          plugin.applet.innerHTML = current_text.slice(0, universal.selection.focusOffset)
                                  + text
                                  + current_text.slice(universal.selection.focusOffset)

          universal.selection.collapse(plugin.applet.childNodes[0], to_move)

          universal.editors[plugin.id].count = true
          this.count(plugin)

        }

      })

    }

    if (universal.selection.anchorNode && universal.selection.rangeCount) {

      const current_applet = universal.selection.anchorNode!
      const text           = current_applet?.textContent!
      const offset         = universal.selection.anchorOffset
      const focus_offset   = universal.selection.focusOffset
      const parent         = current_applet.parentElement!

      let text_to_cut = text
      let cutted_text = ''

      switch (universal.selection.type) {

        case 'Caret':

         if (text.length === 0) {

           plugin.where = 'afterend'

         } else if (offset === 0) {

           plugin.where = 'beforebegin'

         } else {

           //text_to_cut = text.substring(0, offset) + text.substring(text.length)
           //cutted_text = text.substring(offset, text.length)

           //parent.childNodes[0].textContent = text_to_cut
           //plugin.applet.textContent = '.'
           //plugin.applet.childNodes[0].textContent = cutted_text

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
        plugin.container.setAttribute( 'data-paragraphs', `${paragraphs.length}` )
        plugin.container.setAttribute( 'data-senteces',   `${sentences.length}` )
        plugin.container.setAttribute( 'data-characters', `${text.length}` )

      }

    }

    {
      universal.editors[plugin.id].count = false

      let word_length       = 0
      let characters_lenght = 0
      let senteces_length   = 0
      let paragraphs_length = 0
      let persons_length    = 0

      universal.editors[plugin.id].target.childNodes.forEach( item => {

        if (item instanceof HTMLElement) {

          word_length       += parseInt( item.getAttribute( 'data-word' )! )
          characters_lenght += parseInt( item.getAttribute( 'data-characters' )! )
          senteces_length   += parseInt( item.getAttribute( 'data-senteces' )! )
          paragraphs_length += parseInt( item.getAttribute( 'data-paragraphs' )! )
          persons_length    += parseInt( item.getAttribute( 'data-persons' )! )

        }

      })

      universal.editors[plugin.id].words      = word_length
      universal.editors[plugin.id].characters = characters_lenght
      universal.editors[plugin.id].sentences  = senteces_length
      universal.editors[plugin.id].paragraphs = paragraphs_length
      universal.editors[plugin.id].persons    = persons_length

    }

  }

}
