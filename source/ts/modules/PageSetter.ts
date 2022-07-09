import icon_html from '../../icons/html.svg'
import icon_notification from '../../icons/notifications.svg'
import { WhiteBoard } from './WhiteBoard'

export class PageSetter {

  private main          : HTMLElement
  private sidebar_left  : HTMLElement
  private sidebar_right : HTMLElement
  private bar_bottom    : HTMLElement
  private bar_top       : HTMLElement

  public constructor () {

    this.main           = this.get_part('main')
    this.sidebar_left   = this.get_part('left-side-bar')
    this.sidebar_right  = this.get_part('right-side-bar')
    this.bar_bottom     = this.get_part('bottom-bar')
    this.bar_top        = this.get_part('top-bar')

  }

  /**
   * Get the element and return it, if there isn't, just notify.
   */
  private get_part ( name : string ) : HTMLElement {

    const element = document.body.querySelector('.' + name) as HTMLElement

    if (!element) {

      // 1. Notify using 
      WhiteDove.notificationServer.create({

        title: 'PageSetter',
        text: `Did not find the <b>${name}</b> element.`,
        level: 'urgent',
        icon: {

          element: WhiteDove.createIcon(icon_html),
          name : 'pagesetter',

        }

      })

      // 2. Create a replaceable element.
      const replace = document.createElement('div')

      replace.classList.add(name)
      document.body.appendChild(replace)

      return replace

    }

    return element

  }

  /**
   * Run all the functions to properly parse all parts of the page.
   * Add icons, other modules, etc.
   */
  public async parse_all () : Promise<void> {

    const promise_main   = this.parse_main(this.main)
    const promise_top    = this.parse_bar_top(this.bar_top)
    const promise_bottom = this.parse_bar_bottom(this.bar_bottom)
    const promise_left   = this.parse_sidebar_left(this.sidebar_left)
    const promise_right  = this.parse_sidebar_right(this.sidebar_right)

    await promise_main.finally( () =>
      promise_top.finally( () =>
        promise_bottom.finally( () => 
          promise_left.finally( () =>
            promise_right.finally( () =>
              true
            )
          )
        )
      )
    )

  }

  /**
   *
   */
  public async parse_main ( element : HTMLElement ) : Promise<void> {

  }

  /**
   *
   */
  public async parse_sidebar_left ( element : HTMLElement ) : Promise<void> {

  }

  /**
   *
   */
  public async parse_sidebar_right ( element : HTMLElement ) : Promise<void> {

  }

  /**
   *
   */
  public async parse_bar_bottom ( element : HTMLElement ) : Promise<void> {

  }

  /**
   *
   */
  public async parse_bar_top ( parent : HTMLElement ) : Promise<void> {

    const icon_container = document.createElement('span')
    {
      icon_container.classList.add('icon-container')

      const icon_box = document.createElement('span')
      {
        icon_box.classList.add('notification', 'icon-box')
        icon_box.addEventListener( 'click', () => WhiteDove.notificationServer.show_sidebar(icon_box) )

        const icon = WhiteDove.createIcon(icon_notification)

        if (icon) {

          icon.classList.add('icon')
          icon_box.appendChild(icon)

        }

        icon_container.appendChild(icon_box)
      }

      parent.appendChild(icon_container)
    }

  }

}
