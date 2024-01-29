// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import * as Line from "./line"
import * as Plugin from "./plugin"
import * as Core from "./core"

type Parameters = {
	// The plugins for 
	plugins? : Plugin.Plugin[]

	// Whether to add the core plugins or not.
	core?: boolean
}

function create({
	core,
	plugins,
} : Parameters = {
	core: true,
	plugins: [],
}) {
	core = core ?? true
	plugins = plugins ?? []

	if (core)
		plugins.unshift({
			onkeydown: Core.keydown
		})

	const editor = document.createElement('main')
	editor.classList.add('editor')

	const line = Line.create({ plugins })
	editor.append(line)
	line.focus()

	return editor
}

export {
	create,
}
