import { NotificationType } from "../modules/NotificationServer"
import { WhiteBoardData } from "../modules/WhiteBoard"

export {}

declare global {


  /**
   * Creates an SVG Element and returns based on the data..
   * @param d The SVG element in string.
   * @returns A SVG Element.
   * @example
   * await create_icon('<svg>d</svg>', 64);
   */
  function create_icon (d : string, size? : number = 48) : SVGSVGElement | null

  /**
   * Makes the thread sleep for `ms` milliseconds.
   * @param ms milliseconds.
   * @example
   * await sleep(5000);
   */
  async function sleep (ms : number) : Promise<void>

  /**
   * A notification server where all modules can send to inform the user about something.
   */
  namespace notification_server {

    /**
     * Creates a new notification based on information.
     * @param data NotificationType
     * @returns A promise of HTMLElement (the notification).
     * @example
     *  notification_server.create({ title: 'Board', level: 'low', text: 'Did not found the name.'})
     */
    async function create ( data : NotificationType ) : Promise<HTMLElement>

    /**
     * Removes a notification.
     * @param delay In milliseconds.
     * @param notification The HTMLElement of the notification.
     * @returns A promise of void.
     * @example
     *  notification_server.remove(0, notification)
     */
    async function remove ( delay : number, notification : HTMLElement ) : Promise<void>

  }

  /*
   * To create white boards.
   */
  namespace white_board {

    /**
     * Creates a new white board from the file.
     * @param data WhiteBoardData
     * @returns A promise of WhiteBoardData.
     * @example
     *  const whiteboard = whiteboardr.create('/home/iris/story/theater.json')
     */
    async function create ( file : string ) : Promise<WhiteBoardData>

  }

}
