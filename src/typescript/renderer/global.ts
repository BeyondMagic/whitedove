import { Universal } from './interfaces'

export const Global : Universal = {

  // For all the loaded components
  components : {},

  // Boards.
  sleep : (ms : number) : Promise<void> => new Promise(r => setTimeout(r, ms)),

}
