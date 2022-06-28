import svg_close from '../../icons/keyboard_arrow_right.svg'

interface Button {

  readonly name   : string
  readonly action : Function
  readonly level  : 'accept' | 'alternate'
  readonly icon?  : SVGSVGElement | null

}

// #. For modules who has their own notification system
export interface NotificationInit {

  readonly level : 'urgent' | 'normal' | 'low'
  readonly text  : string

  readonly buttons? : Array<Button>
  readonly icon?    : {

    readonly element : SVGSVGElement | null
    readonly name    : string

  }

  time? : number

}

export interface NotificationType extends NotificationInit {

  readonly title : string

}

export class NotificationServer {

  private parent : HTMLElement

  public constructor ( parent : HTMLElement ) {

    const container = document.createElement('main')

    container.classList.add('notification-container')

    parent.appendChild(container)

    this.parent = container

  }

  public async create ( data : NotificationType ) : Promise<HTMLElement> {

    const notification = document.createElement('section')
    {

      notification.classList.add('notification', data.level)

      // #. Calculate the time of the notifcation by its level.
      if (!data.time) {

        switch (data.level) {

          // 1. Will be here forever (infinite).
          case 'urgent': data.time = -1; break

          // 2. Set for 5 seconds.
          case 'normal': data.time = 5000; break

          // 3. Set for 2.5 seconds.
          case 'low':    data.time = 2500; break

        }

      }

      const header = document.createElement('section')
      {
        header.classList.add('header')

        const button = document.createElement('span')
        {

          button.classList.add('button')
          button.addEventListener( 'click', () => this.remove(0, notification))

          const icon = create_icon(svg_close)
          if (icon) {

            icon.classList.add('close')
            button.append(icon)

          }

        }
        header.append(button)
      }

      const date = document.createElement('section')
      {
        date.classList.add('date')
        date.textContent = '1 day'
      }

      if (data.icon && data.icon.element) {

        const icon = document.createElement('section')
        {
          icon.classList.add('icon-container')
          const box = document.createElement('span')
          {
            box.classList.add('icon-box', data.icon.name)
            data.icon.element.classList.add('icon')
            box.append(data.icon.element)
          }
          icon.append(box)
        }

        notification.append(icon)
      }

      const title = document.createElement('section')
      {
        title.classList.add('title')

        {
          const name = document.createElement('span')
          name.classList.add('name')
          name.textContent = data.title
          title.append(name)
        }
      }

      const body = document.createElement('section')
      {
        body.classList.add('body')
        body.insertAdjacentHTML('beforeend', data.text)
      }

      if (data.buttons) {

        const buttons = document.createElement('section')

        buttons.classList.add('buttons')

        data.buttons.forEach( item => {

          const button = document.createElement('span')

          {
            button.classList.add('button', item.level)
            button.addEventListener( 'click', () => {

              this.remove(0, notification)
              item.action()

            })
          }

          if (item.icon) {

            item.icon.classList.add('icon')
            button.append(item.icon)

          }

          {
            const text   = document.createElement('span')
            text.textContent = item.name
            text.classList.add('name')
            button.append(text)
          }

          buttons.append(button)

        })

        notification.append(buttons)
      }

      notification.append(header, title, body, date)
    }

    this.parent.appendChild(notification)

    // #. To remove the notification after a few seconds.
    if (data.time > 0) this.remove(data.time, notification)

    return notification

  }

  public async remove ( delay : number, notification : HTMLElement ) : Promise<void> {

    // #. Just a little test to make sure it's a notification.
    //    Not so sure though.
    if (!notification.classList.contains('notification')) return

    // #. Parse the seconds computed CSS of transition and then make it in miliseconds.
    let transition_time = parseFloat((getComputedStyle(notification).getPropertyValue('transition-duration').slice(0, -1)))
    {
      transition_time *= 1000

      delay -= transition_time
    }

    if (delay > 0) await sleep(delay)

    notification.classList.add('remove')

    await sleep(transition_time)

    notification.remove()

  }

}
