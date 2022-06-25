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
   * await createIcon('M24 26.4 13.65 36.75q-.5.5-1.2.5t-1.2-.5q-.5-.5-.5-1.2t.5-1.2L21.6', 64);
   */
  function createIcon (d : string, size? : number = 48) : SVGSVGElement

  /**
   * Makes the thread sleep for `ms` milliseconds.
   * @param ms milliseconds.
   * @example
   * await sleep(5000);
   */
  async function sleep (ms : number) : Promise<void>

}

