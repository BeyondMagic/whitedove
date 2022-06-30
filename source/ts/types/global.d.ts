import { NotificationType, NotificationHistoryItem } from "../modules/NotificationServer"
import { WhiteBoardData } from "../modules/WhiteBoard"

export {}

declare global {

  /**
   * Creates an SVG Element and returns based on the data..
   * @param d The SVG element in string.
   * @param size Force the viewbox.
   * @returns A SVG Element.
   * @example
   * await create_icon('<svg>d</svg>', 64);
   */
  function create_icon (d : string, size : number = 48) : SVGSVGElement | null

  /**
   * Makes the thread sleep for `ms` milliseconds.
   * @param ms milliseconds.
   * @example
   * await sleep(5000);
   */
  async function sleep (ms : number) : Promise<void>

  /**
   * This is the place to guard any additional paths that will be repeated through the program.
   * Normally it is set at the start of the program.
   */
  namespace system {

    /**
     * This is the path to guard any additional data of the program.
     */
    var data_path : string

  }

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

    /**
    * Save the notification to the history file.
    * @returns boolean `true` if saved correctly. `false` if failed to save.
    * @example
    *   notification_server.backup()
    */
    async function backup () : Promise<boolean>

    /**
    * Loads the page showing the history of notifications.
    * @example
    *   notification_server.page()
    */
    async function page () : Promise<void>

    /**
      * Parse the history file to add to our history. Do this after constructing the class.
      * @example
      *   await notification_server.parse()
      */
    async function parse () : Promise<void>

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
    async function create ( file : string ) : Promise<WhiteBoardData | null>

  }

}
