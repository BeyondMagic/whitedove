import { NotificationType, NotificationHistoryItem } from "../modules/NotificationServer"
import { WhiteBoardData } from "../modules/WhiteBoard"
import { Time } from "../modules/TimeParser"

export {}

declare global {

  /**
    * Global functions and values from our software.
    */
  namespace WhiteDove {

    /**
     * Creates an SVG Element and returns based on the data..
     * @param d The SVG element in string.
     * @param size Force the viewbox.
     * @returns A SVG Element.
     * @example
     *  await WhiteDove.createIcon('<svg>d</svg>', 64);
     */
    function createIcon (d : string, size : number = 48) : SVGSVGElement | null

    /**
     * Makes the thread sleep for `ms` milliseconds.
     * @param ms milliseconds.
     * @example
     *  await WhiteDove.sleep(5000);
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
      *
      */
    namespace timeParser {

      /**
       * Parse a time in base to the future or past.
       * @param date Date | string | number The date to format.
       * @returns string A string on the style `x ago`
       * @example
       *  console.log( WhiteDove.timeParser( new Date('August 19, 1975 23:15:30') ) )
       */
      function parse ( date : Date | string | number = +new Date() ) : string

    }

    /**
     * A notification server where all modules can send to inform the user about something.
     */
    namespace notificationServer {

      /**
       * Creates a new notification based on information.
       * @param data NotificationType Data of the notification to save.
       * @returns A promise of HTMLElement (the notification).
       * @example
       *  WhiteDove.notifcationServer.create({ title: 'Board', level: 'low', text: 'Did not found the name.'})
       */
      async function create ( data : NotificationType ) : Promise<HTMLElement>

      /**
       * Removes a notification.
       * @param notification The element container of that notifcation data.
       * @param position The position of the element. You can get from the notification itself with the tag `data-id`.
       * @returns A promise of void.
       * @example
       *  WhiteDove.notifcationServer.remove(0, notification)
       */
      async function remove ( notification : HTMLElement, position : number ) : Promise<void>

      /**
      * Save the notification to the history file.
      * @returns boolean `true` if saved correctly. `false` if failed to save.
      * @example
      *   WhiteDove.notifcationServer.backup()
      */
      async function backup () : Promise<boolean>

      /**
      * Loads the page showing the history of notifications.
      * @param HTMLElement button The element which will tell that has actived.
      * @example
      *   WhiteDove.notifcationServer.page()
      */
      function show_sidebar ( button : HTMLElement ) : void

      /**
      * To open the configuration page of the NotificationServer.
      * @example
      *   WhiteDove.notificationServer.show_config_page()
      */
      function show_config_page () : void

      /**
      * Parse the history file to add to our history. Do this after constructing the class.
      * @example
      *   await WhiteDove.notificationServer.parse()
      */
      async function parse () : Promise<void>

    }

    /*
     * To create white boards.
     */
    namespace whiteBoard {

      /**
       * Creates a new white board from the file.
       * @param data WhiteBoardData
       * @returns A promise of WhiteBoardData.
       * @example
       *  const whiteboard = WhiteDove.whiteBoard.create('/home/iris/story/theater.json')
       */
      async function create ( file : string ) : Promise<WhiteBoardData | null>

    }

  }
}
