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
	{
		if (plugin.keydown)
			line.addEventListener('keydown', event => plugin.keydown!({ plugins, event }))
		if (plugin.mouseup)
			line.addEventListener('mouseup', event => plugin.mouseup!({ plugins, event }))
		if (plugin.selectstart)
			line.addEventListener('selectstart', event => plugin.selectstart!({ plugins, event }))
		if (plugin.selectionchange)
			line.addEventListener('selectionchange', event => plugin.selectionchange!({ plugins, event }))
	}

	return line
}
