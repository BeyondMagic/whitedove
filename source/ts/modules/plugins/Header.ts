// Completely inspired by https://editorjs.io/tools-api.

// GLOBAL Types and namespaces
type Settings = Object
type Data = Object
// ^^^

export default class Header {

  // Closed.
  private editable : boolean  = false
  private data     : Data     = {}
  private config   : Settings = {}

  // Note: Static getters.
  //       Allows your Tool to substitute pasted HTML tags, files or URLs. 
  private pasteConfig : Object

  //       Automatic sanitize configuration. Allows to clean unwanted HTML tags or attributes from files with Inline Toolbar. 
  private sanitize : Object

  //       Required if Tools should be added to the Toolbox. Describe an icon and title here.
  private toolbox : Object

  //       Shortcut that fires render method and inserts new Block 
  private shortcut : Object

  //       Config allows Tool to specify how it can be converted into/from another Tool. 
  private conversionConfig : Object

  //       With this option, Editor.js won't handle Enter keydowns. Can be helpful for Tools like Code where line breaks should be handled by default behavior. 
  private enableLineBreaks : boolean

  public constructor ( previous : Data, config : Settings, readOnly : boolean,  ) {

  }

  // Note: Creates UI of a Block.
  public render () {

  }

  // Note: Called after Block contents is added to the page.
  public rendered () {

  }

  // Note: Extracts Block data from the UI.
  public save () : Data {

  }

  // Note: Called after Block contents is removed from the page but before Block instance deleted 
  

  // Note: Contain logic for clear Tools stuff: cache, variables, events. Called when Editor instance is destroying.
  public destroy () {

  }

  // Called each time Block contents is updated 
  public updated () {

  } 

  // Validates Block data after saving. If returns false, Block will be skipped on Editor saving.
  public validate () {

  }

  // Method returns HTML that will be appended at the top of Block-settings 
  public renderSettings () {

  }

  // Handle content pasted by ways that described by pasteConfig static getter.
  public onPaste () {

  }

  // Method specifies how to merge two similar Blocks.
  public onMerge () {

  }

  // After the plugin is moved throughout the page, it will receive the index.
  public moved ( index : number ) () {

  }

}
