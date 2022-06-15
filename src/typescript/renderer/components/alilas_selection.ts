// WhiteDove - Component : AlilasSelection
//
// Files to be inserted in the soure code:
//  - alilas_selection.scss
//  - alilas_selection.ts
//
// 1. To make it work, you have to call it upon when the selection of
//    the page changes. For example, read the documentation about:
//    'input', 'beforeinput', 'keydown', 'keyup', to start.
//
// João F. BeyondMagic © 2022 <koetemagie@gmail.com>

import { Component, LanguageData, ExternalConditional, Setting } from '../interfaces'

interface ColorSetting {

  selection : Setting
  cursor    : Setting
  caret     : Setting

}

// #. To be used by other methods and components to identify this plugin and use its methods.
export interface AlilasSelectionInterface extends Component {

  // #. Use to identify the selection of the page.
  //    Might as well change to something else after, more global.
  selection : Selection

  // #. To set the colors of the visual selection.
  colors : ColorSetting

}

// #. Implementation of the plugin.
export class AlilasSelection implements AlilasSelectionInterface {

  // Initialisation.
  public          enabled     = true
  public readonly name        = 'AlilasSelection'
  public readonly authors     = [ 'João F. © BeyondMagic koetemagie@gmail.com' ]
  public readonly events      = [ 'resize' ]
  public readonly date        = 1655059477278
  public readonly conditional : ExternalConditional = {

    required : [ 'ConfigurationPage', 'ChalkBoard' ]

  }
  public readonly description : LanguageData = {

    en : 'To have a far more beautiful visual selection.',

  }

  // Extended.
  private readonly cursor_anchor = document.createElement('span')
  private readonly cursor_focus  = document.createElement('span')
  private readonly cursor_range  = document.createElement('span')
  public  readonly selection     = document.getSelection()!

  // #. The color of the selection and cursor of this component...
  //    To be configured.
  public readonly colors : ColorSetting = {

    selection : {
      field       : '',
      name        : { en : 'Selection' },
      description : { en : 'This is for the range, the back selection.' }
    },
    cursor : {
      field       : '',
      name        : { en : 'Cursor' },
      description : { en : 'The color of the buttons of the range.' }
    },
    caret : {
      field       : '',
      name        : { en : 'Caret' },
      description : { en : 'Individual caret, the bar.' }
    },

  }

  // Plugin worksheet below.
  public constructor () {

    Object.keys(this.colors).forEach( item => {

      const color = getComputedStyle( document.body ).getPropertyValue(`--alilasselection-${item}`)

      console.log(color)

    })

    this.cursor_focus.classList.add('cursor', 'caret', 'inactive', 'hidden')
    this.cursor_anchor.classList.add('cursor', 'range', 'inactive', 'after', 'hidden')

    this.send()

    document.body.appendChild(this.cursor_focus)
    document.body.appendChild(this.cursor_anchor)

  }

  public destroy () {

    document.body.removeChild(this.cursor_focus)
    document.body.removeChild(this.cursor_anchor)

    // Remove all events.
    this.events.forEach( event => {

      window.removeEventListener( event, () => this.send() )

    })

  }

  public config ( open = false, settings? : ColorSetting ) {

    // Set the new colors!
    if (settings) {

    }

    // Open the config page using other component.
    if (open) {

    }

  }

  // Simplify a little bit the process here.
  // ...

  public send = async () : Promise<void> => {

    if (this.selection.rangeCount) {

      console.log(document.getSelection()!.getRangeAt(0))

    }

    /*
    const anchor = this.selection.anchorNode
    const focus  = this.selection.focusNode

    // See 4th note in the component's description.
    if ( !(anchor instanceof HTMLElement) ||
         !(focus  instanceof HTMLElement) ) return;

    const geometry : CursorGeometry = {

      top    : 0,
      left   : 0,
      offset : 0,

      anchor : anchor.getBoundingClientRect()!,
      focus  : focus.getBoundingClientRect()!,

    }

    // #. A single cursor as browesers behave.
    if (this.selection.type === 'Caret') {

      // Saving previous position in case to not trigger animation again.
      const previous_geometry : CursorGeometry = {

        top  : parseInt( this.#cursor_focus.style.top ),
        left : parseInt( this.#cursor_focus.style.left ),

      }

      // Setting classes of the cursors.
      {
        // Hides the other cursor.
        this.#cursor_anchor.classList.add('hidden')

        // Make the focus cursor visible.
        this.#cursor_focus.classList.remove('range')
        this.#cursor_focus.classList.add('caret')
      }

      // #. I don't know why this implemented in the Browser engine, but the cursor is displayed
      //    on the next element before the focus element.
      if (geometry.offset === 1 &&
          // In case we have a character after this one.
          focus.nextElementSibling instanceof HTMLSpanElement) {

        geometry.focus  = focus.nextElementSibling.getBoundingClientRect()
        geometry.offset = 0

      }

      // In case the element selected is the plugin.applet itself.
      if (focus.classList.contains('content')) {

        geometry.top  = geometry.focus.top + 2
        geometry.left = geometry.focus.left

      // In case there is a character selected.
      } else {

        top = geometry.focus.top

        // To put position in...
        switch (geometry.offset) {
          case 0: geometry.left = geometry.focus.left; break  // ... behind the character.
          case 1: geometry.left = geometry.focus.right; break // ... front of the character.
        }

      }

      // Set positions of the cursors on the same place.
      {
        this.#cursor_anchor.style.top  = this.#cursor_focus.style.top  = `${geometry.top}px`
        this.#cursor_anchor.style.left = this.#cursor_focus.style.left = `${geometry.left}px`
      }

      // Trigger the animation of the cursor in case of a new position.
      if (Math.ceil(geometry.top)   !== previous_geometry.top && 
          Math.ceil(geometry.left) !== previous_geometry.left) {

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

        switch (this.selection.anchorOffset) {
          case 0: geometry.left = geometry.anchor.left; break  // Behind the character
          case 1: geometry.left = geometry.anchor.right; break // Front ...
        }

        this.#cursor_focus.style.top  = `${geometry.anchor.top}px`
        this.#cursor_focus.style.left = `${geometry.left}px`
      }

      // Last part of selection.
      {
        this.#cursor_anchor.classList.remove('hidden')

        switch (geometry.offset) {
          case 0: geometry.left = geometry.focus.left; break  // Behind the character
          case 1: geometry.left = geometry.focus.right; break // Front ...
        }

        this.#cursor_anchor.style.top  = `${geometry.focus.top}px`
        this.#cursor_anchor.style.left = `${geometry.left}px`

      }

    }*/

  }

}
