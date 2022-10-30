import * as UI from './UI'
import auth from '../../../.tmp/auth_info.json';
import icon_close from '../../icons/close.svg'

namespace Frontier
{

  /**
   * Will add a button to the page to close.
   * @returns HTMLButtonElement The close element.
   **/
  export function close () : HTMLButtonElement
  {

    const button = UI.generate('button')
    button.classList.add('close')
    button.onclick = () => Neutralino.app.exit()
    {

      const icon = UI.component.create.svg(icon_close, 64, true)
      button.appendChild(icon)

    }

    return button

  }

}

declare namespace Base64
{

  type Type = 'image/jpg' | 'image/png' | 'image/jpeg' | 'audio/wav' | 'audio/mp4'

}

/**
 * Will read a BINARY data and return its formatted Base64 data.
 * @param path string The file to be read.
 * @param type Base64.Type The type of the file.
 * @returns Promise<string | void> Base64 data.
 **/
export async function transform ( path : string, type : Base64.Type ) : Promise<string | void>
{

  const data = await Neutralino.os.execCommand(`base64 ${path}`)

  if (data.stdOut)
  {

    return `data:${type};base64,${data.stdOut.replace(/(\r\n|\n|\r)/gm, '')}`

  }

}

/**
 * Initialise all global events of Neutralino.
 * @returns void
 **/
export function events () : void
{

  Neutralino.events.on( 'windowClose', () => Neutralino.app.exit() )

}


/**
 * Fix Neutralino global variables.
 * @returns void
 **/
export function neutralino_flags () : void
{

  if (!window.NL_TOKEN || !window.NL_PORT || !window.NL_ARGS)
  {

    window.NL_PORT  = auth.port
    window.NL_TOKEN = auth.accessToken
    window.NL_ARGS  =
    [
      'bin/neutralino-linux_x64',
      '',
      '--load-dir-res',
      '--path=.',
      '--export-auth-info',
      '--neu-dev-extension',
      //'--neu-dev-auto-reload'
    ]

  }

}

/**
 * Initialise all the system.
 * @returns void
 **/
export function initialisation () : void
{

  // Fix flags if they need to.
  neutralino_flags()

  // Initialise the Neutralino server and basic settings.
  window.Neutralino.init()

  // Initialise the events for Neutralino.
  events()

  // Add a button to close the application.
  //{
  //  const button = Frontier.close()
  //  document.body.appendChild(button)
  //}


}
