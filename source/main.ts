// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

function create() {
	const editor = document.createElement('main')
	editor.classList.add('editor')

	const line = document.createElement('section')
	line.contentEditable = 'true'

	editor.append(line)

	return editor
}

export {
	create,
}
