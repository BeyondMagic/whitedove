import { EngineScreen } from './modules/writing'
import { Universal } from './modules/interfaces'
//import { ContextMenu } from './modules/writing'
//import { NotificationServer } from './modules/writing'

declare global { var universal : Universal }

window.addEventListener( 'DOMContentLoaded', () => {

  globalThis.universal = {

    editors       : [],
    selection     : document.getSelection()!,
    cursor_anchor : document.createElement('span'),
    cursor_focus  : document.createElement('span'),
    sleep         : (ms : number) => new Promise(r => setTimeout(r, ms)),

    updateCursor: async ( repeat? : boolean ) : Promise<void> => {

      if ( !(universal.selection.anchorNode instanceof HTMLElement) ||
           !(universal.selection.focusNode  instanceof HTMLElement) ) return;

      const positions       = universal.selection.anchorNode.getBoundingClientRect()
      const positions_focus = universal.selection.focusNode.getBoundingClientRect()!

      let top  : Number
      let left : Number

      if (universal.selection.type === 'Caret') {

        universal.cursor_focus.classList.remove('range')
        universal.cursor_focus.classList.add('caret')

        if (universal.selection.anchorNode.classList.contains('content')) {

          top = positions.top + 2
          left = positions.left

        } else {

          top  = positions.top

          switch (universal.selection.focusOffset) {
            case 0: left = positions.left; break;  // Behind the character
            case 1: left = positions.right; break; // Front ...
          }

        }

        universal.cursor_anchor.style.top  = universal.cursor_focus.style.top  = `${top}px`
        universal.cursor_anchor.style.left = universal.cursor_focus.style.left = `${left!}px`

        if (repeat) {

          console.log('it\'s repeating')

        } else {

          universal.cursor_focus.classList.remove('inactive')
          universal.cursor_focus.offsetWidth
          universal.cursor_focus.classList.add('inactive')

        }

        universal.cursor_anchor.classList.add('inactive')

        // Remove all selected marks.
        document.querySelectorAll('span.selected').forEach( item => item.classList.remove('selected') )

      // The type is "Range"
      } else {

        // First part of selection.
        {
          universal.cursor_focus.classList.remove('caret', 'inactive')
          universal.cursor_focus.classList.add('range', 'before')

          switch (universal.selection.anchorOffset) {
            case 0: left = positions.left; break;  // Behind the character
            case 1: left = positions.right; break; // Front ...
          }

          top = positions.top
        }

        universal.cursor_focus.style.top  = `${top}px`
        universal.cursor_focus.style.left = `${left!}px`

        // Last part of selection.
        {
          universal.cursor_anchor.classList.remove('inactive')

          switch (universal.selection.focusOffset) {
            case 0: left = positions_focus.left; break;  // Behind the character
            case 1: left = positions_focus.right; break; // Front ...
          }

          top = positions_focus.top
        }

        universal.cursor_anchor.style.top  = `${top}px`
        universal.cursor_anchor.style.left = `${left!}px`

      }

    },

  }

  const main = document.body.querySelector('.main') as HTMLElement

  const engine = new EngineScreen( main )

  engine.create('You got me!')
  engine.create('Two')

  // Setup cursor.
  {
    universal.cursor_focus.classList.add('cursor', 'caret', 'inactive')
    universal.cursor_anchor.classList.add('cursor', 'range', 'inactive', 'after')
    universal.updateCursor()

    document.body.appendChild(universal.cursor_focus)
    document.body.appendChild(universal.cursor_anchor)
  }

})
