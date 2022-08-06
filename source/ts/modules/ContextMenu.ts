import svg_close from '../../icons/close.svg'

export type ContextMenuPosition = 'auto'        | 
                                  'left-top'    | 'top'    | 'top-right'   |
                                  'left'        | 'right'  | 
                                  'left-bottom' | 'bottom' | 'bottom-right'

export type ContextMenuContainer = HTMLElement

export class ContextMenu {

  /**
    * Create a context menu given the content and returns it.
    * @param HTMLElement Where the element will be put in the DOMTree, must contain the position as 'relative'.
    * @param HTMLElement What will be inside the container.
    * @param boolean Whether this context menu will have a close button.
    * @param ContextMenuPosition Where the context menu will be positioned.
    * @returns HTMLElement The context menu, with the class 'hidden' by default.
    */
  public create ( base : HTMLElement, content : HTMLElement, position : ContextMenuPosition = 'auto', is_close : boolean = true ) : ContextMenuContainer {

    // 1. Create the container of the context menu.
    const container = document.createElement( 'section' )

    // 2. Add default classes, 'hidden' as default.
    container.classList.add( 'context-menu', 'hidden', position )

    // 3. Set up default classes for content.
    content.classList.add('content')

    // 4. Add the content of context menu.
    container.appendChild( content )

    // 5. Add the close button if ordered.
    if (is_close) {

      const close = document.createElement( 'span' )

      close.classList.add( 'button', 'close' )

      // 1. Add the icon representing this icon.
      const icon = WhiteDove.createIcon( svg_close )
      if (icon) {

        icon.classList.add('icon')
        close.appendChild(icon)

      }

      // 2. When we click on it, hide the context menu.
      close.addEventListener( 'click', () => this.hide(container) )

      // 3. Add to the container this button.
      container.appendChild( close )

    }

    // 6. Put the element in the DOMTree.
    base.appendChild( container )

    // 7. Return the context menu.
    return container

  }

  /**
    * Show the context menu (you can use to update its position in case it's auto)
    * @param ContextMenuContainer the context menu itself.
    */
  public show ( container : ContextMenuContainer ) {

    // 1. Recacalculte the position.
    // TODO: Make the calculations in base to its display size.
    if (container.classList.contains( 'auto' )) {

    }

    // 2. Remove the class 'hidden'.
    container.classList.remove( 'hidden' )

  }

  /**
    * Hide the context menu.
    * @param ContextMenuContainer the context menu itself
    */
  public hide ( container : ContextMenuContainer ) {

    // 1. Add the class 'hidden'.
    container.classList.add( 'hidden' )

  }

  /**
    * Toggle the context menu.
    * @ param ContextMenuContainer the context menu itself.
    */
  public toggle ( container : ContextMenuContainer ) {

    // 1. Show the context menu if it's hidden.
    if (container.classList.contains( 'hidden' )) this.show( container )

    // 2. Hide the context menu if it's shown.
    else this.hide( container )

  }

}
