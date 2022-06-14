export interface LanguageData {

  en     : string
  en_GB? : string
  pt_BR? : string
  ja_JP? : string
  fr_FR? : string

}

// To become more modular.
export interface Component {

  // For identification for external modules, the name of the module.
  name        : string
  authors     : Array<string>
  description : LanguageData
  date        : Number
  enabled     : boolean

  // In case it needs extra events to work correctly.
  events? : Array<string>

  // This function will accept any type of event and can return any type of data.
  send (arg?: any) : any

}

export interface ComponentsList {

  [key : string] : Component

}

// 
export interface Universal {

  components          : ComponentsList
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
