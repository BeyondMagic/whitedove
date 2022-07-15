import svg_arrow_right from '../../icons/keyboard_arrow_right.svg'
import svg_clear_all from '../../icons/clear_all.svg'
import svg_notification from '../../icons/notifications.svg'
import svg_settings from '../../icons/settings.svg'

type NotificationLevels = 'urgent' | 'normal' | 'low'

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

// #. For modules who has their own notification system, read: a class with a `notify` method for example like this one.
export interface NotificationInit {

  readonly level : NotificationLevels
  readonly text  : string

  readonly icon? : NotificationIcon

  readonly buttons? : Array<Button>

}

export interface NotificationType extends NotificationInit {

  readonly title : string

  // 1. Set by the `NotificationServer`.

  // 1.1. Note: we're actually re-defining it.
  buttons? : Array<Button>

  // 1.2. This is the unique ID!
  snapshot? : number

  // 1.3. Whenever a notification is read or not.
  read? : boolean

}

export class NotificationServer {

  private counter      : HTMLElement // #. The parent of the counter. On the icon of notifications on the top bar.
  private counter_body : HTMLElement // #. The counter itself, the `textContent` property will have the amount.
  private sidebar      : HTMLElement // #. The whole sidebar, including header titles and search options.
  private sidebar_body : HTMLElement // #. The sidebar list, where notifications are.

  private history      : Array<NotificationType> // #. Where the data of all notifications will be contained.

  private history_file : string // #. Name of the file for history in disk.
  private directory    : string // #. Name of the folder to be used with `history_file` in disk.

  public constructor ( parent : HTMLElement, directory : string = WhiteDove.system.data_path, file : string = '/history.json' ) {

    const page = document.createElement('main')
    {
      page.classList.add('notification-page')
      parent.append(page)
    }

    const counter = document.createElement( 'span' )
    {
      counter.classList.add('counter')
      WhiteDove.pageSetter.bar_top_notification_icon.appendChild(counter)
    }

    // #. Initial definitions.
    this.sidebar        = page
    this.sidebar_body   = document.createElement( 'section' )
    this.counter        = WhiteDove.pageSetter.bar_top_notification_icon
    this.counter_body   = counter

    this.history        = []

    this.history_file   = directory + file
    this.directory      = directory

  }

  /**
    * Save the notification to the history variable of NotificationServer.
    * @param NotificationType Data of the notification to save.
    * @example
    *   this.save(notification_data)
    */
  private save ( data : NotificationType ) : void {

    this.history.push(data)

  }

  /**
    * Notify from this module with the default settings and without saving to history.
    * @param NotificationInit The initial notification to load.
    * @example
    *   this.notify({ text: 'lol', '' })
    */
  private notify ( data : NotificationInit ) : void {

    this.create({

      // 1. Set by data.
      text    : data.text,
      level   : data.level,
      buttons : data.buttons,

      // 2. Defaults.
      title   : 'NotificationServer',
      icon    : {

        element: WhiteDove.createIcon(svg_notification),
        name: 'notification_server'

      }

    })

  }

  /**
    * Add each notifcation from `this.history` and then add it to the sidebar.
    * Just run this once.
    * @example
    *   await this.create_side_bar()
    */
  private async create_side_bar () : Promise<void> {

    this.sidebar.classList.add('hidden')

    const header = document.createElement('section')
    {
      header.classList.add('header')

      // 1. Left part of the header.
      const left = document.createElement('section')
      {
        left.classList.add('left')

        // 1.1. Add a text for `Notifications`.
        const label = document.createElement('span')
        {
          label.textContent = 'Notifications'
          label.classList.add('label')
          left.appendChild(label)
        }
      }
      header.appendChild(left)

      // 2.1. Right part of the header.
      const right = document.createElement('section')
      {
        right.classList.add('right')
        const clear = document.createElement('span')
        {
          clear.classList.add('clear', 'button')

          clear.addEventListener('click', () => console.log('aaaaaaaaa') )

          const icon = WhiteDove.createIcon(svg_clear_all)
          if (icon) {

            icon.classList.add('icon')
            clear.appendChild(icon)

          }
        }

        // 2.2. This symbol is used to open the configuration page of the NotificationServer.
        const config = document.createElement('span')
        {
          config.classList.add('config', 'button')

          config.addEventListener('click', () => this.show_config_page() )

          const icon = WhiteDove.createIcon(svg_settings)
          if (icon) {

            icon.classList.add('icon')
            config.appendChild(icon)

          }
        }
        right.append(clear, config)

      }
      header.appendChild(right)

    }

    const list = this.sidebar_body
    {
      list.classList.add('notification-list')

      this.history.forEach( item => {

        const notification = this.create_notification(item)

        list.insertAdjacentElement( 'afterbegin', notification)

      })
    }

    this.sidebar.append(header, list)

  }

  /**
    * Create the element of notification given the data.
    * @param data NotificationType | NotificationHistoryItem The data of the notificaiton to be created in a HTML element.
    * @param snapshot The time being taken this notifcation.
    * @example
    *   const notification = this.create_notification(data, +new Date())
    *   notification.classList.add('mine-special')
    */
  private create_notification ( data : NotificationType ) : HTMLElement {

    const notification = document.createElement('section')
    {

      // 1. Add an event so that when we hover through it, we make it `read` true.
      notification.addEventListener( 'mouseover', () => {

        // 1.1. Note: Perhaps we can actually just get the last since this function will run after the push.
        //            Making this part a little bit too redudant.
        const id = this.history.indexOf(data)

        this.history[id].read = true

        // 1.2. Run the count to already make them read-in.
        this.count()

      // 1.3. Only run this event once. Just learned this!
      }, { once: true } )

      notification.setAttribute('data-id', String(data.snapshot))
      notification.classList.add('notification', data.level)

      const header = document.createElement('section')
      {
        header.classList.add('header')

        const button = document.createElement('span')
        {

          button.classList.add('button')
          button.addEventListener( 'click', () => this.remove( notification ) )

          const icon = WhiteDove.createIcon(svg_arrow_right)
          if (icon) {

            icon.classList.add('close')
            button.append(icon)

          }

          header.append(button)
        }
      }

      const date = document.createElement('section')
      {
        date.classList.add('date')
        date.textContent = WhiteDove.timeParser.parse(data.snapshot)
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

      if ('buttons' in data && data.buttons) {

        const buttons = document.createElement('section')

        buttons.classList.add('buttons')

        data.buttons.forEach( item => {

          const button = document.createElement('span')

          {
            button.classList.add('button', item.level)
            button.addEventListener( 'click', () => {

              this.remove(notification)
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

    return notification

  }

  /**
    * Update the counter of notifications on the icon.
    * @example
    *   this.count()
    */
    private count () : void {

      // TODO: Just count the unread notifications.
      const total = this.history.filter( item => !item.read ).length

      // 1. Set the number of notifications.
      this.counter_body.textContent = String(total)

      // 2. To apply a new style for the icon element.
      if (total > 0) this.counter.classList.add( 'unread' )
      else           this.counter.classList.remove( 'unread' )

    }

  public async create ( data : NotificationType ) : Promise<HTMLElement> {

    // 1. Set defaults for the notification data.
    {
      // 1.1. The time being taken.
      data.snapshot = +new Date()

      // 1.2. Make it unread by default.
      data.read = false
    }

    // #. Add to the history.
    this.save(data)

    // #. Create the element with the data.
    const notification = this.create_notification(data)

    // #. Add in the body list the element so that we can see.
    this.sidebar_body.appendChild(notification)

    // #. Count the unread notifications now.
    this.count()

    return notification

  }

  public async remove ( notification : HTMLElement ) : Promise<void> {

    // #. Just a little test to make sure it's a notification.
    //    Not so sure though.
    if (!notification.classList.contains('notification')) return

    // #. Parse the seconds computed CSS of transition and then make it in miliseconds.
    let transition_time = parseFloat(
      ( getComputedStyle(notification).getPropertyValue('transition-duration').slice(0, -1) )
    ) * 1000

    notification.classList.add('remove')

    await WhiteDove.sleep(transition_time)

    // Remove from body.
    notification.remove()

    // Remove from history by finding the element with the same ID (data).
    {
      // Get the position from the element itself.
      let position = parseInt( notification.getAttribute('data-id')! )
      let index : number

      for (let i = 0; i < this.history.length; i++) {

        if (this.history[i].snapshot === position) {

          index = i
          this.history.splice(index, 1)
          break

        }

      }

    }

    this.count()

  }

  public async backup () : Promise<boolean> {

    // 1. Remove certain things about the notification.
    const history_string = this.history.map( item => {

      // 1.1. To change the `icon.element` of the notification to a string that can be saved in the file.
      if (item.icon && item.icon.element) item.icon.element = item.icon.element.outerHTML as any

      // 1.2. To remove the buttons property.
      //      Not usre even if this is "fixable", so a note on here.
      //      NOTE: perhaps we can save the action to the file.
      if (item.buttons) item.buttons = undefined

      return item

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

  public async parse () : Promise<void> {

    // 1. Parse each notification.
    this.history = await Neutralino.filesystem.readFile(this.history_file).then( data => {

      const unparsed_history = JSON.parse(data) as Array<NotificationType>

      const parsed_history = unparsed_history.map( (item, index) => {

        const msg = `The notification <b>${index}<b>`

        // 1. Testing the item.
        {
          // #. Make sure the title exists.
          if (!('title' in item)) throw `${msg} does not have the property 'title'.`

          // #. Make sure the level can exist.
          if (!('level' in item)) throw `${msg} does not have the property 'level'.`
          else {
            let strange_level = false

            Array.from(
              ['urgent', 'normal', 'low'] as Array<NotificationLevels>
            ).forEach( level => {

                strange_level = (level === item.level)

            })

            if (strange_level) throw `${msg} has a unrecognised level.`
          }

          // #. Make sure the body text exists.
          if (!('text' in item && typeof item.text === 'string')) throw `${msg} text property does not exist or it's not a string.`

          // #. Make sure the icon exists.
          if ('icon' in item && item.icon) {

            if (typeof item.icon.name !== 'string') throw `${msg} the name property of icon is not a string!`

            if (typeof item.icon.element !== 'string') throw `${msg} the element property of icon is not an string!`

          } else throw `${msg} the icon property does not exist.`

          // #. Make sure snapshot, the time being taken, exists.
          if (!('snapshot' in item)) throw `${msg} the snapshot property does not exist.`

          // #. Make sure read, if was seen by the user, exists.
          if (!('read' in item)) throw `${msg} the read property does not exist.`

        }

        // 2. Parse the icon element.
        if (item.icon && item.icon.element) item.icon.element = WhiteDove.createIcon(item.icon.element)

        return item

      })

      return parsed_history

    })
    // 2. In case of error.
    .catch( error => {

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

      console.error(error)

      return [] as Array<NotificationType>

    })

    this.count()

    // 3. Add to the sidebar.
    await this.create_side_bar()

  }

  public show_config_page () : void {

    console.log('うあっ')

  }

  public show_sidebar ( button : HTMLElement ) : void {

    if (this.sidebar.classList.contains('hidden')) {

      this.sidebar.classList.remove('hidden')
      button.classList.add('active')

    } else {

      this.sidebar.classList.add('hidden')
      button.classList.remove('active')

    }

  }

}
