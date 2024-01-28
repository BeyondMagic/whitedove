// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import serve from "./server"
import css from "./css/main.css"
import root from "./html/root.html"

globalThis.web_socket_command = 'reload'

global.web_socket?.send(global.web_socket_command)

async function fetch(req : Request) {
	const url = new URL(req.url)

	if (url.pathname === "/main.css")
		return new Response(css, {
			headers: { "Content-Type": "text/css" },
		})

	return new Response(root, {
		headers: { "Content-Type": "text/html" }
	})
}

export default serve({
	port: 1984,
	hostname: "0.0.0.0",
	fetch,
})
