import { contextBridge } from 'electron'
import { cpus } from 'os'

contextBridge.exposeInMainWorld( 'system', {

  profile : <number> cpus().length,

})
