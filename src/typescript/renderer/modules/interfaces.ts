export interface Universal {

  editors   : Array<EditorEventInput>
  selection : Selection
  sleep     : Function

  updateCursor  : Function
  cursor_anchor : HTMLSpanElement
  cursor_focus  : HTMLSpanElement

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
