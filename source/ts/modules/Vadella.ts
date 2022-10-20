
export interface Plugin {

  data : {

    type : string

  }

  self : {

    // Static variables.
    read_only : boolean
    index     : string

    // Methods.
    render() : HTMLElement
    data()   : Object
    destroy() : void

  }

  init {

    name        : string
    type        : string
    description : string
    author      : string
    date        : number

  }


}

export interface Page {

  Data : {

    content : Array<PluginSelf>

    information : {

      saved : boolean
      date  : number

    }

  }

}

export default class Vadella {

  private pages : Array<PageData> = []
  private history_pages : Array<PageData> = []

  public constructor ( container : HTMLElement ) {

    

  }

  /**
    *
    *
    *
    * */
  public addPage ( data? : PageData ) {

  }

  /**
    *
    *
    * */
  public addPlugin ( plugin : Plugin, data? : PluginData ) {


  }

  private saveToHistor () {

  }

  public removePlugin ( page_index : number, plugin_index : number ) {

    this.pages[page_index].content[plugin_index].destroy()

  }

}
