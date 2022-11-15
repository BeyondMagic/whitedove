import * as Animations from './UI/Animations'

export function generate<K extends keyof HTMLElementTagNameMap> (tagname: K, ...tokens : string[]) : HTMLElementTagNameMap[K]
{

  const element = document.createElement(tagname)

  element.classList.add('ui', tagname, ...tokens)

  return element

}


export namespace component {

  export namespace create
  {

    /**
     * Will create a SVG element given its HTML data.
     * @todo Add a test to see if it is really SVG data.
     * @param data string The SVT data itself.
     * @param size number The viewBox size of the SVG.
     * @param replace boolean Replace the native size.
     * @returns SVGElement
     **/
    export function svg ( data : string, size : number = 16, replace : boolean = false) : SVGElement
    {

      const template = document.createElement('template')
      {
        data = data.trim()
        template.innerHTML = data
      }

      const svg = template.content.firstElementChild as SVGElement
      svg.classList.add('ui', 'svg')

      svg.removeAttribute('width')
      svg.removeAttribute('height')

      if (replace || !svg.getAttributeNS(null, 'viewBox'))
      {
        svg.setAttributeNS(null, 'viewBox', `0 0 ${size} ${size}`)
      }

      return svg


    }

    export namespace input
    {

      type Inputs =
        'button' | 'checkbox' | 'color' | 'date' |
        'datetime-local' | 'email' | 'file' | 'hidden' |
        'image' | 'month' | 'number' | 'password' | 'radio' |
        'range' | 'reset' | 'search' | 'submit' | 'tel' |
        'text' | 'time' | 'url' | 'week'

      /**
       * Create an input element with <generate> and return it.
       * @returns HTMLDivElement The input element.
       **/
      function create ( nametype : Inputs ) : HTMLDivElement 
      {

        const element = generate('div')

        element.classList.add(nametype)

        element.contentEditable = 'true'

        return element

      }

      /**
       * A radio with its own UI design.
       * @returns HTMLInputElement The input-radio element.
       **/
      export function search () : HTMLDivElement
      {

        const element = create('search')

        element.onkeydown = e =>
        {

          switch (e.key)
          {

            case 'Enter': e.preventDefault()

            break

          }

        }

        return element

      }

      /**
       * A radio with its own UI design.
       * @returns HTMLInputElement The input-radio element.
       **/
      export function radio () : HTMLDivElement
      {

        const element = create('radio')

        //element.onclick = () => Animations.explosion.bubble(element)

        return element

      }

    }

  }

}
