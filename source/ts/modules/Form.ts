export type FormButtonType = 'checkbox' | 'radio'
export type FormButtonState = 'disabled' | 'selected' | 'unselected' | 'focused'
export type FormButton = HTMLInputElement

export class Form {

  /**
    * Create a button given the style and its initial state.
    * @param FormButton Which type the button is.
    * @param FormButtonState Which initial state it has
    * @return FormButton The button that can be used elsewhere.
    */
  public button ( type : FormButtonType, state : FormButtonState ) : FormButton {

    // 1. Create the input element.
    const input = document.createElement( 'input' )

    // 2. Add the type of the input.
    input.type = type

    // 3. Apply its default classes.
    input.classList.add( 'form', 'button', type )

    // 4. Restrict given the state
    switch (state) {

      // I. Immediately focus.
      case 'focused':
        input.focus()
      break

      // II. Disable it by adding a class.
      case 'disabled':
        input.classList.add(state)
      break

      // III. Check it.
      case 'selected':
        input.checked = true
      break

      // IV. Do nothing.
      //case 'unselected': break

    }

    // 5. Return the button.
    return input

  }

}
