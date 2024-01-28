// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

namespace Line {
	export function create() {
		const line = document.createElement('section')

		line.contentEditable = 'true'
		line.classList.add('line')

		line.onkeydown = event => {
			switch (event.key) {
				case 'Enter':
					const range = window.getSelection()?.getRangeAt(0)
					if (range && (!range.startOffset && !range.endOffset))
						line.before(create())
					else
						line.after(create())
					event.preventDefault()
					break
				default:
					break
			}
		}

		return line
	}
}

function create() {
	const editor = document.createElement('main')
	editor.classList.add('editor')

	editor.append(Line.create())

	return editor
}

export {
	create,
}
