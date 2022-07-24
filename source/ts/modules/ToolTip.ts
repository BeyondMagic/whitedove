import svg_info from '../../icons/description.svg'

export type ToolTipPosition    = 'top-left' | 'top' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right'
export type ToolTipEffect      = 'mouseover' | 'click'
export type ToolTipActivated   = 'on' | 'off'
export type ToolTipType        = 'information' | 'description' | 'action'

export class ToolTip {

  private svg_information : HTMLElement
  private svg_description : HTMLElement
  private svg_action      : HTMLElement

  public constructor () {

    this.svg_description = this.create_icon_container( WhiteDove.createIcon(svg_info)! )
    this.svg_action      = this.create_icon_container( WhiteDove.createIcon(svg_info)! )
    this.svg_information = this.create_icon_container( WhiteDove.createIcon(svg_info)! )

  }

  /**
    * Create a HTMLElement that can be easily stylized within the grid of the tooltip.
    * @param svg SVGElement The icon itself.
    * @returns HTMLElement The section with the class 'icon-container'.
    */
  private create_icon_container ( svg : SVGElement ) : HTMLElement {

    const icon_container = document.createElement('section')
    {
      icon_container.classList.add('icon-container')

      const svg_container = document.createElement('section')
      {
        svg_container.classList.add('svg-container')

        svg.classList.add('svg')
        svg_container.appendChild(svg)
      }

      icon_container.appendChild(svg_container)
    }

    return icon_container

  }

  /**
    * Returns the type of icon for a certain type rapidly.
    * @param type ToolTipType The type of icon TooltTip has idea of.
    * @returns Node The The section with the class 'icon-container'.
    */
  private find_icon ( type : ToolTipType ) : Node {

    switch (type) {

      case 'information': return this.svg_information.cloneNode(true)
      case 'action':      return this.svg_action.cloneNode(true)
      case 'description': return this.svg_description.cloneNode(true)

    }

  }

  /**
    * Create the element that will apear when the tooltip is affected.
    * @param text string The HTML string content.
    * @param typo ToolTipType Type of the tooltip.
    * @param position ToolTipPosition Where the element has to be positioned.
    * @returns HTMLElement The tooltip container.
    */
  private create_tooltip ( text : string, type : ToolTipType, position : ToolTipPosition ) : HTMLElement {

    const tooltip = document.createElement( 'section' )
    {
      tooltip.classList.add('tooltip')
      tooltip.classList.add(position)

      const icon_container = this.find_icon(type) as HTMLElement
      {
        icon_container.classList.add(type)
      }

      const text_container = document.createElement('section')
      {
        text_container.classList.add('text')
        text_container.insertAdjacentHTML( 'beforeend', text )
      }

      tooltip.append( icon_container, text_container )
    }

    return tooltip

  }

  public add ( element : HTMLElement, text : string, type : ToolTipType, position : ToolTipPosition,
               effect : ToolTipEffect = 'mouseover', time : number = 2000, left : number = 500) : void {

    // 1.. This element is the tooltip that will hide and show.
    const tooltip = this.create_tooltip( text, type, position )

    // 2. When we click the element for the tooltip to appear.
    if (effect === 'click') {

      // #. Show the tooltip after a few time hovering or clicking.
      element.addEventListener( effect , () => {

        // 1. When we have to hide the tooltip.
        if (element.classList.contains('tooltip-active')) {

          // #. Disable its styling.
          element.classList.remove( 'tooltip-active' )

          tooltip.classList.remove( 'active' )

        }

        // 2. When we have to show the tooltip.
        else {

          // #. Active  its styling.
          element.classList.add( 'tooltip-active' )

          tooltip.classList.add( 'active' )

        }

      })

    }

    // 3. When we have to hover for some time for the tooltip to show itself.
    else {

      // #. Disappear the tooltip after hover out long enough.
      element.addEventListener( effect , () => {

      })

    }

    // 1.1. Add finally the tooltip to the element.
    element.appendChild(tooltip)

  }

}
