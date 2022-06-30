import svg_close from '../../icons/keyboard_arrow_right.svg'
import svg_notification from '../../icons/notifications.svg'

interface Button {

  readonly name   : string
  readonly action : Function
  readonly level  : 'accept' | 'alternate'
  readonly icon?  : SVGSVGElement | null

}

interface NotificationIcon {

  element : SVGSVGElement | null
  readonly name    : string

}

// #. For history.
export interface NotificationHistoryItem {

  readonly level : 'urgent' | 'normal' | 'low'
  readonly text  : string

  readonly icon? : NotificationIcon

}

// #. For modules who has their own notification system
export interface NotificationInit extends NotificationHistoryItem {

  readonly buttons? : Array<Button>

  time? : number

}

export interface NotificationType extends NotificationInit {

  readonly title : string

}

export class NotificationServer {

  private parent       : HTMLElement
  private history      : Array<NotificationHistoryItem>
  private history_file : string
  private directory    : string

  public constructor ( parent : HTMLElement, directory : string = system.data_path, file : string = '/history.json' ) {

    const container = document.createElement('main')

    container.classList.add('notification-container')

    parent.appendChild(container)

    this.parent       = container
    this.history_file = directory + file
    this.directory    = directory
    this.history      = []

  }

  public async parse () : Promise<void> {

    // #. Parse each notification.
    this.history = await Neutralino.filesystem.readFile(this.history_file).then( data => {

      const unparsed_history = JSON.parse(data) as Array<NotificationHistoryItem>

      const parsed_history = unparsed_history.map( (item, index) => {

        const msg = `The notification [${index}]`

        {
          if (!('level' in item)) throw `${msg} does not have the property 'level'.`

          // #. Make sure the level can exist.
          {
            let strange_level = false

            Array.from(['urgent', 'normal', 'low']).forEach( level => {

                strange_level = (level === item.level)

            })

            if (strange_level) throw `${msg} has a unrecognised level.`
          }

          if (!('text' in item && typeof item.text === 'string')) throw `${msg} text property does not exist or it's not a string.`

          if ('icon' in item && item.icon) {

            if (typeof item.icon.name !== 'string') throw `${msg} the name property of icon is not a string!`

            if (typeof item.icon.element !== 'string') throw `${msg} the element property of icon is not an string!`

          }

        }

        // 1. Return the item with icon.
        if (item.icon) {

          return {

            level : item.level,
            text  : item.text,
            icon  : {

              element : create_icon(String(item.icon.element)),
              name    : item.icon.name,

            }

          }

        // 2. Return the item without icon.
        } else {

          return {

            level : item.level,
            text  : item.text,

          }

        }

      })

      return parsed_history

    }).catch( error => {

      // #. Create the folder and file if not found.
      if (error.code === 'NE_FS_FILRDER') {

        Neutralino.filesystem.createDirectory(this.directory)

        Neutralino.filesystem.writeFile(this.history_file, JSON.stringify([], null, 2)).then( () => {

          this.notify({
            text  : `Created the history file on <b>${this.history_file}</b>`,
            level : 'urgent'
          })

        })
      }

      //this.notify
      console.error(error)

      return [] as Array<NotificationHistoryItem>

    })

  }

  /**
    * Save the notification to the history variable of NotificationServer.
    * @param NotificationType Data of the notification to save.
    * @example
    *   this.save(notification_data)
    */
  private save ( data : NotificationType ) : void {

    if (data.icon) {

      const notification : NotificationHistoryItem = {

        level : data.level,
        text  : data.text,
        icon  : {

          name    : data.icon.name,
          element : data.icon.element,

        }

      }

      this.history.push(notification)

    } else {

      const notification : NotificationHistoryItem = {

        level : data.level,
        text  : data.text,

      }

      this.history.push(notification)

    }

  }

  /**
    * Notify from this module with the default settings.
    * @param NotificationInit The initial notification to load.
    * @example
    *   this.notify({ text: 'lol', '' })
    */
  private notify ( data : NotificationInit ) : void {

    this.create({

      title   : 'NotificationServer',
      text    : data.text,
      level   : data.level,
      buttons : data.buttons,
      icon    : {

        element: create_icon(svg_notification),
        name: 'notification_server'

      }

    })

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

    // #. To add on history.
    this.save(data)

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

  public async backup () : Promise<boolean> {

    // #. To change the `icon.element` of the notification to a string that can be saved in the file.
    const history_string = this.history.map( item => {

      if (item.icon && item.icon.element) item.icon.element = item.icon.element?.outerHTML as any

    })

    return Neutralino.filesystem.writeFile(this.history_file, JSON.stringify(history_string, null, 2)).then( () => {

      this.notify({
        text  : `History file saved`,
        level : 'low'
      })

      return true

    }).catch( error => {

      if ('code' in error) {

        this.notify({
          text  : `Failed to save history file`,
          level : 'urgent',
          // TODO: Buttons to retry.
        })

      }

      console.error(error)

      return false

    })

  }

  public async page () : Promise<void> {

    console.log(this.history)

  }

}
