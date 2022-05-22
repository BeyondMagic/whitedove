import { EngineScreen } from './modules/writing'
import { Universal } from './modules/interfaces'
//import { ContextMenu } from './modules/writing'
//import { NotificationServer } from './modules/writing'

declare global { var universal : Universal }

window.addEventListener( 'DOMContentLoaded', () => {

  globalThis.universal = {

    editors   : [],
    selection : document.getSelection()!,
    cursor    : document.createElement('span'),
    sleep     : (ms : number) => new Promise(r => setTimeout(r, ms)),

    updateCursor: async () : Promise<void> => {

      if ( !(universal.selection.anchorNode instanceof HTMLElement) ) return;

      const positions = universal.selection.anchorNode.getBoundingClientRect()

      let top  : Number
      let left : Number

      if (universal.selection.anchorNode.classList.contains('content')) {

        top = positions.top - 1
        left = positions.left + 2

      } else {

        top  = positions.top - 3

        // Front or behind?
        if (universal.selection.focusOffset === 0) {

          left = positions.left

        // focusOffset === 1
        } else {

          left = positions.right

        }

      }

      universal.cursor.style.top  = `${top}px`
      universal.cursor.style.left = `${left}px`

      universal.cursor.classList.remove('inactive')
      universal.cursor.offsetWidth
      universal.cursor.classList.add('inactive')

    },

  }

  // Setup cursor.
  {
    universal.cursor.classList.add('cursor', 'caret', 'inactive')
    document.body.appendChild(universal.cursor)
  }

  const main = document.body.querySelector('.main') as HTMLElement

  const engine = new EngineScreen( main )

  engine.create('You got me!')

})
