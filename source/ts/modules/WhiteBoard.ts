import { NotificationInit } from "../modules/NotificationServer"
import description from '../../icons/description.svg'

export interface WhiteBoardInit {

  name     : string,
  synopsis : string,
  authors  : Array<string>,

}

export interface WhiteBoardData extends WhiteBoardInit {

  container : HTMLElement,
  file      : string,

}

export class WhiteBoard {

  public  data   : Array<WhiteBoardData>
  private parent : HTMLElement

  public constructor ( parent : HTMLElement ) {

    const container = document.createElement('main')

    container.classList.add('whiteboard-container')

    parent.appendChild(container)

    this.parent = container

    this.data = []

  }

  /**
   *  Create a container for the this WhiteBoard.
   *  @param WhiteBoardData The data for this container.
   *  @returns HTMLElement The container
   *  @example
   *  const page = this.create_container(file_data.pages)
   */
  private create_container ( data : WhiteBoardData ) : HTMLElement {

    const container = document.createElement('section')

    {
      container.classList.add('container')

      const header = document.createElement('section')
      {
        header.classList.add('header')
        container.append(header)

        // #. An icon to show the file path.
        const file_container = document.createElement('span')
        {
          const name = document.createElement('span')
          name.classList.add('name')
          name.textContent = data.file

          const icon = create_icon(description)

          if (icon) {

            icon.classList.add('icon')
            file_container.append(icon)

          }

          file_container.classList.add('file-container')
          file_container.append(name)
        }

        header.append(file_container)

      }

      const board = document.createElement('section')
      {
        board.classList.add('board')
        container.append(board)
      }

      const information = document.createElement('section')
      {
        information.classList.add('information')
        container.append(information)
      }

      this.parent.append(container)
    }

    return container

  }

  /**
   * Parse the error thrown by Neutralino when something fails.
   * @param any ErrorCode of Neutralino.
   * @returns string The message parsed.
   * const message = this.parse_error(error)
   */
  private parse_error ( error : any ) : string {

    if (error instanceof Object && 'code' in error) {

      return `<b>${error.code}</b><br>${error.message}`

    } else {

      return error

    }

  }

  /**
    * Load file and parse to JSON, then verify if it's a valid WhiteBoardData file.
    * @param string The file path.
    * @returns WhiteBoardInit | null The initial file for whiteboard 
    */
  private async parse ( file : string ) : Promise<WhiteBoardInit | null> {

    return Neutralino.filesystem.readFile(file).then( content => {

      const data : WhiteBoardInit = JSON.parse( content )

      console.log(data)

      if (!('name' in data)) throw 'No property for name';

      return data

    }).catch( error => {

      console.error(error)
      this.notify({text: this.parse_error(error), level: 'urgent'})

      return null

    })

  }

  /**
    * Save file to the path with the whiteboard data.
    * @param string The file path.
    * @param WhiteBoardData The data of the whiteboard to save.
    * @returns boolean `true` if saved correctly or `false` if failed.
    */
  private save ( file : string, whiteboard : WhiteBoardData ) : boolean {

    const data = JSON.stringify(whiteboard, null, 2)

    Neutralino.filesystem.writeFile(file, data).then( () => {

      this.notify({text: `Whiteboard <b>${whiteboard.name}</b>saved in the file. <b>${file}</b>`, level: 'low'})

      return true

    }).catch( error => {

      console.error(error)

      this.notify({
        text: this.parse_error(error), level: 'urgent',
        buttons: [

          {
            level: 'accept',
            name: 'Retry',
            action: () => this.save(file, whiteboard),
          },

          //{
          //  level: 'alternate',
          //  name: 'Save to another path.',
          //  action: () => console.log('lol'),
          //}

        ]
      })

    })

    return false

  }

  public async create ( file : string ) : Promise<WhiteBoardData | null> {

    const init = await this.parse(file)

    if (!init) return null

    this.data.push(init as WhiteBoardData)

    // 1. Define WhiteBoard new defaults.
    const whiteboard = this.data[this.data.length - 1]
    {
      // #. Original file path.
      whiteboard.file = file

      // #. Create board container (page).
      whiteboard.container = this.create_container(whiteboard)
    }

    this.notify({ text: `The file <b>${file}</b> was loaded into the WhiteBoard.`, level: 'low' })

    return whiteboard

  }

  private notify (data : NotificationInit ) : void {

    notification_server.create({

      title   : 'WhiteBoard',
      text    : data.text,
      level   : data.level,
      buttons : data.buttons

    })


  }

}
