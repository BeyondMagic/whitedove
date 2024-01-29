// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import serve from "./server"

globalThis.web_socket_command = 'reload'

global.web_socket?.send(global.web_socket_command)

// Hell.
// Will write the source file to a temporary file, then build it, then delete it.
// See https://github.com/oven-sh/bun/issues/4502
const javascript = (async () => {
	const { build, file, write, } = await import("bun")

	// Import the file to link properly to the hot-reloader.
	await import("./editor/main")

	// To delete files, Bun does not have a delete API function.
	const { unlinkSync: remove } = await import("node:fs")

	// Read actually the content tof the file!
	const text = await file("./renderer/editor/main.ts").arrayBuffer()

	// Write temporary file.
	await write("tmp.ts", text)

	//// Build the file.
	const result = await build({ entrypoints: ['./renderer/editor/main.ts'] })

	// Delete the file.
	remove("tmp.ts")

	// Return content of the file (first one).
	return result.outputs[0].text()
})()

async function fetch(req : Request) {
	const url = new URL(req.url)

	const { default: css } = await import("./css/main.css")
	const { default: root } = await import("./html/root.html")

	if (url.pathname === "/main.css")
		return new Response(css, {
			headers: { "Content-Type": "text/css" }
		})

	if (url.pathname === '/main.js')
		return new Response(await javascript, {
			headers: { "Content-Type": "text/javascript" }
		})

	return new Response(root, {
		headers: { "Content-Type": "text/html; charset=utf8" }
	})
}

export default serve({
	port: 1984,
	hostname: "0.0.0.0",
	fetch,
})
