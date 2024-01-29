import * as Line from "./line"
import * as Plugin from "./plugin"
import * as Selection from "./selection"

export const keydown : Plugin.Keyboard = ({
	event,
	plugins,
}) => {
	const selection = Selection.get()
	const range = selection.getRangeAt(0)
	const source = event.target as HTMLElement | undefined
	if (!source)
		throw Error("core.keydown: Cannot find source.")

	const text = source.textContent ?? ''

	switch (event.key) {
		case 'Enter':
			event.preventDefault()
			{
				const new_line = Line.create({ plugins })

				// If not caret, make it  e

				// TODO: only Caret.
				switch (range.endOffset)
				{
					// Start of the line.
					case 0:
						source.before(new_line)
						break;

					// End of the line
					case text.length:
						source.after(new_line)
						new_line.focus()
						break;

					// Between the extreme points of the line.
					default:
						new_line.textContent = text.substring(range.endOffset, text.length)
						source.after(new_line)
						source.textContent = text.substring(0, range.endOffset)
						new_line.focus()
				}
			}
			break
	}
}
