import { EngineScreen } from './modules/writing'
import { Universal } from './modules/interfaces'
//import { ContextMenu } from './modules/writing'
//import { NotificationServer } from './modules/writing'

declare global { var universal : Universal }

window.addEventListener( 'DOMContentLoaded', () => {

  globalThis.universal = {

    editors      : [],
    selection    : document.getSelection()!,
    cursor       : document.createElement('span'),
    cursor_focus : document.createElement('span'),
    sleep        : (ms : number) => new Promise(r => setTimeout(r, ms)),

    updateCursor: async () : Promise<void> => {

      if ( !(universal.selection.anchorNode instanceof HTMLElement) ) return;

      const positions       = universal.selection.anchorNode.getBoundingClientRect()
      const positions_focus = universal.selection.focusNode.getBoundingClientRect()

      let top  : Number
      let left : Number

      if (universal.selection.type === 'Caret') {

        universal.cursor.classList.remove('range')
        universal.cursor.classList.add('caret')

        if (universal.selection.anchorNode.classList.contains('content')) {

          top = positions.top + 2
          left = positions.left

        } else {

          top  = positions.top

          // Front or behind?
          if (universal.selection.focusOffset === 0) left = positions.left;
          else left = positions.right;

        }

        universal.cursor.style.top  = `${top}px`
        universal.cursor.style.left = `${left}px`

        universal.cursor.classList.remove('inactive')
        universal.cursor.offsetWidth
        universal.cursor.classList.add('inactive')

      // The type is "Range"
      } else {

        // First part of selection.
        {
          universal.cursor.classList.remove('caret', 'inactive')
          universal.cursor.classList.add('range', 'before')

          if (universal.selection.anchorOffset === 0) left = positions.left;
          else left = positions.right;

          top = positions.top
        }

        universal.cursor.style.top = `${top}px`
        universal.cursor.style.left = `${left}px`

        // Last part of selection.
        {
          universal.cursor_focus.classList.remove('caret', 'inactive')
          universal.cursor_focus.classList.add('range', 'after')

          if (universal.selection.focusOffset === 0) left = positions_focus.left;
          else left = positions_focus.right;

          top = positions_focus.top
        }

        universal.cursor_focus.style.top = `${top}px`
        universal.cursor_focus.style.left = `${left}px`


      }

    },

  }

  // Setup cursor.
  {
    universal.cursor.classList.add('cursor', 'caret', 'inactive')
    universal.cursor_focus.classList.add('cursor', 'range', 'inactive')

    document.body.appendChild(universal.cursor)
    document.body.appendChild(universal.cursor_focus)
  }

  const main = document.body.querySelector('.main') as HTMLElement

  const engine = new EngineScreen( main )

  engine.create('You got me!')

})
