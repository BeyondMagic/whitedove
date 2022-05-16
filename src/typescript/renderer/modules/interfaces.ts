export interface Universal {

  editors : Array<EditorEventInput>

}

export interface PluginInit {

  data?      : any
  focus?     : boolean
  after?     : HTMLElement
  type       : 'Paragraph' | 'Dialogue' | null
  id         : number
  selection? : Selection | null

}

export interface PluginInterface extends PluginInit {

  applet     : HTMLDivElement
  container  : HTMLElement
  aside      : HTMLElement
  countable  : boolean
  where?     : 'beforeend' | 'beforebegin' | 'afterend' | 'afterbegin'

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

  container   : HTMLElement // .writing
  target      : HTMLElement // .text-container
  information : HTMLElement // .information
}
