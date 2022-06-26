import { NotificationInit } from "../modules/NotificationServer"
import right_icon from '../../icons/keyboard_arrow_right.svg'

export interface WhiteBoardData {

  name: '',
  container : HTMLElement,

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

  public async create ( file : string ) : Promise<WhiteBoardData> {

    //const board = this.parse(file)
    const whiteboard = <WhiteBoardData>{}

    // 1. Create board container (page).
    whiteboard.container = document.createElement('section')
    {
      whiteboard.container.classList.add('container')

      const header = document.createElement('section')
      {
        header.classList.add('header')
        whiteboard.container.append(header)
      }

      const board = document.createElement('section')
      {
        board.classList.add('board')

        const icon = create_icon(right_icon)

        if (icon) board.append(icon)

        whiteboard.container.append(board)
      }

      const information = document.createElement('section')
      {
        information.classList.add('information')
        whiteboard.container.append(information)
      }

      this.parent.append(whiteboard.container)
    }

    this.notify({ text: `The file <b>${file}</b> was loaded into the WhiteBoard.`, level: 'low' })

    this.data.push(whiteboard)

    return this.data[this.data.length - 1]

  }

  private notify (data : NotificationInit ) : void {

    //notification_server.create({

    //  title: 'WhiteBoard',
    //  text: data.text,
    //  level: data.level,
    //  buttons: data.buttons

    //})


  }

}
