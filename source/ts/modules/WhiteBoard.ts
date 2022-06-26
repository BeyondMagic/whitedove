import { NotificationInit } from "../modules/NotificationServer"
import right_icon from '../../icons/keyboard_arrow_right.svg'

export interface WhiteBoardInit {

  name: '',

}

export interface WhiteBoardData extends WhiteBoardInit {

  container : HTMLElement,
  file : string,

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
   *  Create a page for the this file.
   *  @param Array<PagesData> The list pages.
   *  @returns HTMLElement The container
   *  @example
   *  const page = this.create_container(file_data.pages)
   */
  private create_container () : HTMLElement {

    const container = document.createElement('section')

    {
      container.classList.add('container')

      const header = document.createElement('section')
      {
        header.classList.add('header')
        container.append(header)
      }

      const board = document.createElement('section')
      {
        board.classList.add('board')

        const icon = create_icon(right_icon)

        if (icon) board.append(icon)

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
    * Load file and parse to JSON, then verify if it's a valid WhiteBoardData file.
    * @param string 
    */
  private parse ( file : string ) : WhiteBoardInit | null {

    Neutralino.filesystem.readFile(file).then( content => {

      const data : WhiteBoardData = JSON.parse( content )

      if (!('name' in data)) throw 'No property for name';

      return data

    }).catch( error => {

      console.error(error)

      if (error instanceof Object && 'code' in error) {

        this.notify({text: `<b>${error.code}</b><br>${error.message}`, level: 'urgent'})

      } else {

        this.notify({text: error, level: 'urgent'})

      }

    })

    return <WhiteBoardData>{}

  }

  public async create ( file : string ) : Promise<WhiteBoardData | null> {

    const init = this.parse(file)

    if (!init) return null

    const whiteboard = init as WhiteBoardData

    // 1. Create board container (page).
    whiteboard.container = this.create_container()

    //this.notify({ text: `The file <b>${file}</b> was loaded into the WhiteBoard.`, level: 'low' })

    this.data.push(whiteboard)

    return this.data[this.data.length - 1]

  }

  private notify (data : NotificationInit ) : void {

    notification_server.create({

      title: 'WhiteBoard',
      text: data.text,
      level: data.level,
      buttons: data.buttons

    })


  }

}
