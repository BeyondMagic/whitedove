// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import * as Line from "./line"

function create() {
	const editor = document.createElement('main')
	editor.classList.add('editor')

	const line = Line.create()
	editor.append(line)
	line.focus()

	return editor
}

export {
	create,
}
