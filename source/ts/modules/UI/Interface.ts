import * as Home from './types/Home'

function clean () : void
{

  document.body.setAttribute('class', 'ui body')

  document.body.innerHTML = ''

}

export async function select ( stage : Stage ) : Promise<void>
{

  clean()

  switch (stage)
  {

    case 'home': Home.Init(); break;

  }

}

