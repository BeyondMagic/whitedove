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

      const to_focus_text = () => {

 // If there are no elements.
        if (plugin.applet.children.length === 0) {

          universal.selection.collapse(plugin.applet, 0)

          universal.updateCursor()

        } else {

          setTimeout( () => {

            const character = universal.selection.focusNode?.parentElement

            if (character instanceof HTMLSpanElement) {

              universal.selection.collapse(character, universal.selection.focusOffset)

              universal.updateCursor()

            }

          }, 0)

        }

      }

      plugin.applet.addEventListener( 'click', () => to_focus_text() )
      plugin.container.addEventListener( 'focusin', () => to_focus_text() )
      plugin.container.addEventListener( 'focusout', () => universal.updateCursor() )

      plugin.applet.addEventListener( 'keydown', async event => {

        // Removes the transition delay when the user is inputing too many characters.
        {
          if (event.repeat) {

            universal.cursor_anchor.style.transitionDuration = universal.cursor_focus.style.transitionDuration = '0ms'

          } else {

            universal.cursor_anchor.style.transitionDuration = universal.cursor_focus.style.transitionDuration = ''

          }
        }

        switch (event instanceof KeyboardEvent && event.key) {

          case 'A':
          case 'a':

            // Simulate, select everything!
            if (event.ctrlKey) {

              const range = document.createRange()

              const first = plugin.applet.firstElementChild
              const last  = plugin.applet.lastElementChild

              if (
                  // Can't select nothing!
                  plugin.applet.children.length !== 0 &&
                  // Can't select the same thing!
                  !(first?.classList.contains('selected') && last?.classList.contains('selected'))
                 ) {

                range.setStart(plugin.applet.firstElementChild!, 0)
                range.setEnd(plugin.applet.lastElementChild!, 1)

                universal.selection.removeAllRanges()
                universal.selection.addRange(range)

                Array.from(plugin.applet.children).forEach( item => item.classList.add('selected') )

                event.preventDefault()
                return universal.updateCursor()

              } else {

                event.preventDefault()

              }

            }

          break

          case 'Escape':

            plugin.applet.querySelectorAll('.new').forEach( element => element.classList.remove('new') )

            event.preventDefault()
            return universal.updateCursor()

          break

          case 'Backspace':

            if (
                 // If it's at the start of the content.
                 universal.selection.focusOffset === 0 
                 // And it's not the last plugin on the paper.
                 && universal.editors[plugin.id].container.children[0] !== plugin.container
               ) {

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

          case 'ArrowDown':
          case 'ArrowUp':
          case 'ArrowRight':
          case 'ArrowLeft':

            // To select.
            if (event.shiftKey) {

              setTimeout( () => {

                const anchor = universal.selection.anchorNode?.parentElement
                const focus  = universal.selection.focusNode?.parentElement

                if (anchor instanceof HTMLSpanElement &&
                    focus instanceof HTMLSpanElement) {

                  const range = document.createRange()

                  // To select in front... [0, 1]
                  // Note: specialities of WebKit must be implemented here.
                  if (universal.selection.focusOffset === 0 &&
                      universal.selection.anchorOffset === 1) {

                    console.log('AAAAAAAA', focus, anchor)

                    range.setStart(focus.previousElementSibling!, 1)
                    range.setEnd(anchor, 1)

                    console.log(range)

                  // To select in front... [1, 1] after above is selected once.
                  } else if (universal.selection.focusOffset === 1 &&
                            universal.selection.anchorOffset === 1) {

                    console.log('BBBB', focus, anchor)

                    range.setEnd(focus, 1)
                    range.setStart(anchor, 1)

                  // To select in behind... [1, 0]
                  } else {

                    range.setEnd(focus, 1)
                    range.setStart(anchor, 0)

                  }

                  // Add the '.selected' class to the non-visual yet selected elements
                  {

                    const start = range.startContainer as HTMLSpanElement
                    const end   = range.endContainer as HTMLSpanElement

                    plugin.applet.querySelectorAll('.selected').forEach( item => item.classList.remove('selected') )

                    let element : Element | null = start

                    while (element instanceof HTMLSpanElement) {

                      element.classList.add( 'selected' )

                      if (element === end) break

                      element = element.nextElementSibling

                    }

                  }

                  universal.selection.removeAllRanges()
                  universal.selection.addRange(range)

                  universal.updateCursor()

                }

              }, 0)

              break

            // To move.
            } else {

              setTimeout( () => {

                const character = universal.selection.focusNode?.parentElement

                if (character instanceof HTMLSpanElement) {

                  universal.selection.collapse(character, universal.selection.focusOffset)

                  universal.updateCursor()

                }

              }, 0)

            }

          break

          case 'End':

            if (event.shiftKey) break

            setTimeout( () => {

              const focus = universal.selection.focusNode!

              if (focus instanceof Text) {

                // Note: focusOffset seems to be always '1' for 'End'.
                universal.selection.collapse( focus.parentElement, 1)

                universal.updateCursor()

              }

            }, 0)

          break

          case 'Home':

            if (event.shiftKey) break

            setTimeout( () => {

              const focus = universal.selection.focusNode!

              if (focus instanceof Text) {

                let position : number = 0
                let element  : Element | null
                const parent = focus.parentElement!

                switch (universal.selection.focusOffset) {

                  // If behind, just focus on element before.
                  case 0: 

                    // If it's the first character.
                    if (parent === plugin.applet.firstElementChild) {

                      position = 0

                    // Any other
                    } else {

                      position = 1

                    }

                    element = parent

                  break

                  // If front, just focus on the character before that.
                  case 1:

                    position = 0
                    element = parent.nextElementSibling!

                  break

                }

                universal.selection.collapse( element!, position)

                universal.updateCursor()

              }

            }, 0)

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

          break

        }

      })

      plugin.applet.addEventListener( 'beforeinput' , async event => {

        switch (event instanceof InputEvent && event.inputType) {

          case 'historyRedo':    case 'historyUndo':
          case 'insertFromDrop': //case 'insertFromPaste':
          case 'deleteByCut':    case 'deleteContentBackward': case 'deleteWordBackward':
          case 'insertText':     case 'insertCompositionText':

            universal.editors[plugin.id].count = true

            // 1. Delete the previous selection.
            //    Returns true in case there was a selection to be removed.
            const remove_selection = () : boolean => {
              // In case it's range (block of selection).
              if (!universal.selection.isCollapsed) {

                // All selected elements.
                const selected = plugin.applet.querySelectorAll('.selected')

                // If everything is selected.
                if (plugin.applet.children.length === selected.length) {

                  universal.selection.collapse( plugin.applet, 0 )

                } else {

                  let element : Element | null | undefined

                  switch (universal.selection.focusOffset) {

                    // Put the element before the focus element.
                    case 0:
                      element = universal.selection.focusNode?.parentElement?.previousElementSibling
                    break
                    // Put the cursor after the focus element.
                    case 1:
                      element = universal.selection.focusNode?.parentElement?.nextElementSibling
                    break

                  }

                  if (element) universal.selection.collapse( element, 1 )

                }

                // Remove all selected elements
                selected.forEach( item => item.remove() )

                return true

              }

              return false
            }

            switch (event.inputType) {

              case 'deleteContentBackward':

                // In case there was a selection, just remove it.
                if (remove_selection()) {

                  universal.updateCursor()
                  event.preventDefault()
                  break

                }

                // To remove a character before it or the whole plugin.
                else if (universal.selection.focusNode instanceof HTMLElement) {

                  const character_to_remove = universal.selection.focusNode
                  const previous_character  = character_to_remove.previousElementSibling

                  // If it's after the character.
                  if (character_to_remove instanceof HTMLSpanElement &&
                      universal.selection.focusOffset === 1) {

                    character_to_remove.remove()

                  }

                  // Focus on the previous character.
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

                remove_selection()

                const range = universal.selection.getRangeAt(0)

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
                if (new_character) {

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
