// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import serve from "./server"
import css from "../source/css/main.css"
import root from "../source/html/root.html"

globalThis.web_socket_command = 'reload'

global.web_socket?.send(global.web_socket_command);

export default serve({
	web_socket_path: 'live_reload_websocket',
	port: 1984,
	hostname: "0.0.0.0",
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/main.css")
			return new Response(css, {
				headers: { "Content-Type": "text/css" },
			});

		return new Response(root, {
			headers: { "Content-Type": "text/html" },
		});
	},
});
