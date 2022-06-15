export interface LanguageData {

  readonly en     : string
  readonly en_GB? : string
  readonly pt_BR? : string
  readonly ja_JP? : string
  readonly fr_FR? : string

}

export interface Setting {

  readonly name        : LanguageData
  readonly description : LanguageData

  field : any

}

export interface ExternalConditional {

  readonly required? : Array<string>
  readonly optional? : Array<string>

}

// To become more modular.
export interface Component {

  // For identification for external modules, the name of the module.
  readonly name        : string
  readonly authors     : Array<string>
  readonly description : LanguageData
  readonly date        : Number
           enabled     : boolean

  // In case it needs extra events to work correctly.
  readonly events? : Array<string>

  // Other components that can work with this.
  readonly conditional? : ExternalConditional

  // This function will accept any type of event and can return any type of data.
  send (arg?: any) : any

  // To remove the component from the page.
  destroy (arg: void) : any

  // To configurate the plugin.
  config (open: boolean, settings: any) : any

}

export interface ComponentsList {

  [key : string] : Component

}

// 
export interface Universal {

  readonly components          : ComponentsList
  sleep (arg: number) : Promise<void>

}

export interface PluginInit {

  data?      : any
  focus?     : boolean
  after?     : HTMLElement
  type       : Function | null
  id         : number

}

export interface PluginInterface extends PluginInit {

  applet        : HTMLDivElement
  container     : HTMLElement
  aside         : HTMLElement
  countable     : boolean
  where?        : 'beforeend' | 'beforebegin' | 'afterend' | 'afterbegin'

}

export interface EditorEventInput {
  id         : number
  persons    : number
  paragraphs : number
  sentences  : number
  characters : number
  words      : number

  file       : string
  name       : string
  event      : string
  event_type : string

  count      : boolean

  add        : PluginInit

  settings    : HTMLElement // .settings
  container   : HTMLElement // .writing
  target      : HTMLElement // .text-container
  information : HTMLElement // .information
}
