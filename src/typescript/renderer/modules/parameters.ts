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

        switch (event instanceof KeyboardEvent && event.key) {

          case 'Escape':

            plugin.applet.querySelectorAll('.new').forEach( element => element.classList.remove('new') )

          break

          case 'Backspace':

            if (universal.selection.focusOffset === 0 &&
                universal.editors[plugin.id].container.children[0] !== plugin.container) {

              const element = plugin.container.previousElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                // If there are no characters.
                if (element.children.length === 0) {

                  element.focus()

                } else {

                  universal.selection.collapse(element.lastElementChild, 1)

                }

                universal.updateCursor()

                plugin.container.remove()

                event.preventDefault()

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

          case 'ArrowRight':

            if (universal.selection.anchorNode?.nextSibling) {

              universal.selection.collapse(universal.selection.anchorNode!.nextSibling, 1)

            }

            universal.updateCursor()
            event.preventDefault()

          break

          case 'ArrowLeft':

            if (universal.selection.anchorNode!.previousSibling) {

              universal.selection.collapse(universal.selection.anchorNode!.previousSibling, 1)

            }

            universal.updateCursor()
            event.preventDefault()

          break

          case 'ArrowDown':

            if (universal.selection.focusOffset === plugin.applet.innerText.length) {

              const element = plugin.container.nextElementSibling?.querySelector('.content')

              if (element instanceof HTMLElement) {

                console.log('lol')

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

            } else {

              universal.selection.collapse(current_character.nextElementSibling, 0)

            }

            universal.updateCursor()

            event.preventDefault()

          break

          case 'End':

            console.log()

            if (current_character === plugin.applet.lastElementChild) {

              universal.selection.collapse(current_character, 1)

            } else {

              universal.selection.collapse(current_character, 0)

            }

            universal.updateCursor()

            event.preventDefault()

          break

          case 'ArrowDown':
          case 'ArrowUp':

            if (current_character === plugin.applet.firstElementChild) {

              universal.selection.collapse(current_character, 0)

            } else {

              universal.selection.collapse(current_character, 1)

            }

            universal.updateCursor()

            event.preventDefault()

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

                  if (character_to_remove instanceof HTMLSpanElement) {

                    character_to_remove.remove()

                  }

                  if (previous_character instanceof HTMLSpanElement) {

                    universal.selection.collapse(previous_character, 1)

                  }

                  universal.updateCursor()
                  event.preventDefault()

                }

              break

              case 'insertText':

                const range     = universal.selection.getRangeAt(0)

                const new_character = document.createElement('span')
                new_character.classList.add('character', 'new')
                new_character.textContent = event.data

                const commonAncestor = range.commonAncestorContainer as HTMLElement

                if (commonAncestor instanceof HTMLElement &&
                    commonAncestor.classList.contains('content')) {

                  range.insertNode(new_character)

                } else if (commonAncestor instanceof HTMLSpanElement) {

                  commonAncestor.insertAdjacentElement('afterend', new_character)

                }

                // In case the character was deleted.
                if (new_character.textContent?.length !== 0) {

                  universal.selection.collapse(new_character, 1)

                }

                universal.updateCursor()

                plugin.applet.dispatchEvent( new Event('input'))

                event.preventDefault()

              break

            }

          break

        }

      })

      plugin.applet.addEventListener( 'input', async () => {

        console.log(plugin.applet.innerHTML)

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
        plugin.container.setAttribute( 'data-characters', `${text.length}` )
        plugin.container.setAttribute( 'data-senteces',   `${sentences.length}` )
        plugin.container.setAttribute( 'data-paragraphs', `${paragraphs.length}` )

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

      if (word_length     > 0 || characters_lenght > 0 ||
          senteces_length > 0 || paragraphs_length > 0 ||
          persons_length  > 0 ) {

        universal.editors[plugin.id].information.style.display = 'flex'
        universal.editors[plugin.id].information.classList.add('active')

      } else {

        universal.editors[plugin.id].information.style.display = 'hidden'
        universal.editors[plugin.id].information.classList.remove('active')

      }

      universal.editors[plugin.id].words      = word_length
      universal.editors[plugin.id].characters = characters_lenght
      universal.editors[plugin.id].sentences  = senteces_length
      universal.editors[plugin.id].paragraphs = paragraphs_length
      universal.editors[plugin.id].persons    = persons_length

      const word_element = universal.editors[plugin.id].information.querySelector('.word')!.firstElementChild!
      const characters_element = universal.editors[plugin.id].information.querySelector('.characters')!.firstElementChild!
      const sentences_element = universal.editors[plugin.id].information.querySelector('.sentences')!.firstElementChild!
      const paragraphs_element = universal.editors[plugin.id].information.querySelector('.paragraphs')!.firstElementChild!
      const persons_element = universal.editors[plugin.id].information.querySelector('.persons')!.firstElementChild!

      word_element.textContent       = String(word_length)
      characters_element.textContent = String(characters_lenght)
      sentences_element.textContent  = String(senteces_length)
      paragraphs_element.textContent = String(paragraphs_length)
      persons_element.textContent    = String(persons_length)

    }

  }

}
