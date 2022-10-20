export {}

declare global {

  /**
    * Global functions and values from our software.
    */
  namespace Astrellys {

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
      * The main element where information will be displayed.
      **/
    var main : HTMLElement

     /**
    * The whiteboard, where we're going to write everything, including support plugins.
    */
    namespace Vadella {

      /**
       *
       **/

    }

  }

}
