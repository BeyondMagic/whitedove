export namespace explosion
{


  /**
   * Will make a special explosion around the intended element.
   * Note: "square" sized.
   * @param target HTMLElement The target element.
   **/
  export async function bubble ( target : HTMLElement ) : Promise<void>
  {

    if (target.clientWidth <= 0 || target.clientHeight <= 0) return

    console.log(target)

  }

}

