import { NotificationServer } from "../modules/NotificationServer"

export {}

declare global {

  /**
   * For all types of SVG icons.
   */
  var icons = {

    close : string

  }

  /**
   * Creates an Icon based on the path.
   * @param d The vectors of the icon, the `d` parameter of `path`.
   * @param size The width and height of the icon.
   * @returns A SVG Element.
   * @example
   * await create_icon('M24 26.4 13.65 36.75q-.5.5-1.2.5t-1.2-.5q-.5-.5-.5-1.2t.5-1.2L21.6', 64);
   */
  function create_icon (d : string, size? : number = 48) : SVGSVGElement

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

}
