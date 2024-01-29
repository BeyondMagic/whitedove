import * as Selection from "./selection"
import * as Plugin from "./plugin"

export type Parameters = {
	plugins : Plugin.Plugin[]
}

// Function: Create line with content and return its element.
export function create({
	plugins,
} : Parameters) {
	const line = document.createElement('section')

	line.contentEditable = 'true'
	line.classList.add('line')

	const selection = Selection.get()

	for (const plugin of plugins)
		if (plugin.onkeydown)
			line.addEventListener('keydown', event => plugin.onkeydown!({ plugins, source: line, selection, event }))

	return line
}
