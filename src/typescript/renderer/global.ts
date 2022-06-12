export const Global = {

  // For all the loaded components
  components : {},

  // Boards.
  sleep : (ms : number) : Promise<void> => new Promise(r => setTimeout(r, ms)),

}
