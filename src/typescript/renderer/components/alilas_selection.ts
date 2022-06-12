// WhiteDove - Component : aliasselection
//
// Files to be inserted in the soure code:
//  - alilas_selection.scss
//  - alilas_selection.ts
//
// 1. This component is intended to be used with any type of 
//    Input that has selection, or a caret and is possible to select.
//    It does not rely on anything but itself.
//
// 2. To make it work, you have to call it upon when the selection of 
//    the page changes. For example, read the documentation about:
//    'input', 'beforeinput', 'keydown', 'keyup', to start.
//
// João F. BeyondMagic © 2022 <koetemagie@gmail.com>

import { Component, LanguageData } from '../interfaces'

export class component implements Component {

  // Settling defaults.
  enabled     = true
  name        = 'aliasselection'
  authors     = [ 'João F. © BeyondMagic koetemagie@gmail.com' ]
  event       = [ 'resize' ]
  date        = 1655059477278 
  description : LanguageData = {

    en    : 'To have a far more beautiful type of selection.',

  }

  // For the plugin to work with.
  #cursor_anchor = document.createElement('span')
  #cursor_focus  = document.createElement('span')
  #selection     = document.getSelection()!

  // Simplify a little bit the process here.
  // ...

  public constructor () {

    this.#cursor_focus.classList.add('cursor', 'caret', 'inactive', 'hidden')
    this.#cursor_anchor.classList.add('cursor', 'range', 'inactive', 'after', 'hidden')

    this.send()

    document.body.appendChild(this.#cursor_focus)
    document.body.appendChild(this.#cursor_anchor)

  }

  // The global function.
  public send = async () : Promise<void> => {

    // If there's no selection or caret, at all.
    if (!this.#selection.anchorNode) {

      return this.#cursor_anchor.classList.add('hidden')

    } else {

      this.#cursor_anchor.classList.remove('hidden')

    }

    const anchor = this.#selection.anchorNode
    const focus  = this.#selection.focusNode

    if ( !(anchor instanceof HTMLElement) ||
         !(focus  instanceof HTMLElement) ) return;

    const positions       = anchor.getBoundingClientRect()
    let positions_focus   = focus.getBoundingClientRect()

    let top    : number
    let left   : number
    let offset : number = this.#selection.focusOffset

    if (this.#selection.type === 'Caret') {

      // Saving previous position in case to not trigger animation again.
      const previous_top  = parseInt( this.#cursor_focus.style.top )
      const previous_left = parseInt( this.#cursor_focus.style.left )

      // Setting classes of the cursors.
      {
        // Hides the other cursor.
        this.#cursor_anchor.classList.add('hidden')

        // Make the focus cursor visible.
        this.#cursor_focus.classList.remove('range')
        this.#cursor_focus.classList.add('caret')
      }

      // #. I don't know why this implemented in the Webkit'ss engine, but the cursor is displayed
      //    on the next element before the focus element.
      if (offset === 1 && focus.nextElementSibling instanceof HTMLSpanElement) {

        positions_focus = focus.nextElementSibling.getBoundingClientRect()
        offset          = 0

      }

      // In case the element selected is the plugin.applet itself.
      if (focus.classList.contains('content')) {

        top  = positions_focus.top + 2
        left = positions_focus.left

      // In case there is a character selected.
      } else {

        top = positions_focus.top

        // To put position in...
        switch (offset) {
          case 0: left = positions_focus.left; break  // ... behind the character.
          case 1: left = positions_focus.right; break // ... front of the character.
        }

      }

      // Set positions of the cursors on the same place.
      {
        this.#cursor_anchor.style.top  = this.#cursor_focus.style.top  = `${top}px`
        this.#cursor_anchor.style.left = this.#cursor_focus.style.left = `${left!}px`
      }

      // Trigger the animation of the cursor in case it's a new position.
      if (Math.ceil(top)   !== previous_top && 
          Math.ceil(left!) !== previous_left) {

        this.#cursor_focus.classList.remove('inactive')
        this.#cursor_focus.offsetWidth
        this.#cursor_focus.classList.add('inactive')
      }

      // Remove all selected marks.
      document.querySelectorAll('span.selected').forEach( item => item.classList.remove('selected') )

    // The type is "Range"
    } else {

      // First part of selection.
      {
        this.#cursor_focus.classList.remove('caret', 'inactive')
        this.#cursor_focus.classList.add('range', 'before')

        switch (this.#selection.anchorOffset) {
          case 0: left = positions.left; break  // Behind the character
          case 1: left = positions.right; break // Front ...
        }

        top = positions.top
      }

      this.#cursor_focus.style.top  = `${top}px`
      this.#cursor_focus.style.left = `${left!}px`

      // Last part of selection.
      {
        this.#cursor_anchor.classList.remove('hidden')

        switch (offset) {
          case 0: left = positions_focus.left; break  // Behind the character
          case 1: left = positions_focus.right; break // Front ...
        }

        top = positions_focus.top
      }

      this.#cursor_anchor.style.top  = `${top}px`
      this.#cursor_anchor.style.left = `${left!}px`

    }

  }

}
