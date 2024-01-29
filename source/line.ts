import * as Selection from "./selection"
// Function: Create line with content and return its element.
export function create() {
	const line = document.createElement('section')

	line.contentEditable = 'true'
	line.classList.add('line')

	line.onkeydown = event => {
		const selection = window.getSelection()
		if (!selection)
			throw Error("Selection not found.")

		const range = selection.getRangeAt(0)
		if (!range)
			throw Error("Range not found.")
	const selection = Selection.get()

		const text = line.textContent ?? ''
		console.log(event)

		switch (event.key) {
			case 'Enter':
				event.preventDefault()
				{
					const new_line = create()

					// TODO: only Caret.
					switch (range.endOffset)
					{
						// Start of the line.
						case 0:
							line.before(new_line)
							break;

						// End of the line
						case text.length:
							line.after(new_line)
							new_line.focus()
							break;

						// Between the extreme points of the line.
						default:
							new_line.textContent = text.substring(range.endOffset, text.length)
							line.after(new_line)
							line.textContent = text.substring(0, range.endOffset)
							new_line.focus()
					}
				}
				break
		}
	}

	return line
}
