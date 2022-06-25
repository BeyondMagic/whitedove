export interface Button {

  readonly name   : string
  readonly action : Function
  readonly level  : 'accept' | 'dismiss'

}

interface NotificationType {

  readonly title : string
  readonly level : 'urgent' | 'normal' | 'low'
  readonly text  : string

  readonly buttons? : Array<Button>

  // Default action if click.
  readonly action? : Function

  time? : number

}

export class NotificationServer {

  private parent : HTMLElement
  
  /*
    *
    */
  public constructor ( parent : HTMLElement ) {

    const container = document.createElement('main')

    container.classList.add('notification-container')

    parent.appendChild(container)

    this.parent = container

  }

  /*
    *
    *
    */
  public async create ( data : NotificationType ) : Promise<void> {

    const notification = document.createElement('section')

    notification.classList.add('notification', data.level)

    {

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

          const icon = createIcon(icons.close)
          {
            icon.classList.add('close')
            button.append(icon)
          }

        }
        header.append(button)
      }

      const title = document.createElement('section')
      {
        title.classList.add('title')

        title.textContent = data.title
      }

      const body = document.createElement('section')
      {
        body.classList.add('body')
        body.textContent = data.text
      }

      if (data.buttons) {

        const buttons = document.createElement('section')

        buttons.classList.add('buttons')

        data.buttons.forEach( item => {

          const button = document.createElement('span')

          button.textContent = item.name
          button.classList.add('button', item.level)

          button.addEventListener( 'click', () => {

            this.remove(0, notification)
            item.action()

          })

          buttons.append(button)

        })

        notification.append(buttons)
      }

      notification.append(header, title, body)
    }

    this.parent.appendChild(notification)

    // #. To remove the notification after a few seconds.
    if (data.time > 0) this.remove(data.time, notification)


  }

  /*
    *
    */
  public async remove ( delay : number, notification : HTMLElement ) : Promise<void> {

    // Parse the seconds computed CSS of transition and then make it in miliseconds.
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

  /*
    *
    */
  //private create_button ( notification : HTMLElement, data : Button, clas : string ) : HTMLElement {



  //}

}
