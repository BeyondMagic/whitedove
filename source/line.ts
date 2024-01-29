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

	for (const plugin of plugins)
		if (plugin.onkeydown)
			line.addEventListener('keydown', event => plugin.onkeydown!({ plugins, event }))

	return line
}
