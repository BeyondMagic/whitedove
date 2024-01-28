// aab (MIT License ) © 2023
// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import { WebSocket } from "ws"

import type {
  Server,
  WebSocketHandler,
  WebSocketServeOptions,
} from "bun"

function get_signature(socket : string) : string {
	// Code will be added into the HTML.
	const code = () => {
		const socket = new WebSocket('ws://*')

		socket.onmessage = (msg) => {
			if (msg.data === global.web_socket_command)
				location.replace(location.href)
		}

		console.log('Live reload enabled.')
	}

	const signature = '<script type="application/javascript">(' +
		code.toString()
		.replace('*', socket)
		.replace('global.web_socket_command', '"' + global.web_socket_command + '"')
		+ ')()</script>'

	return signature
};

export type PureWebSocketServeOptions<WebSocketDataType> = Omit<
  WebSocketServeOptions<WebSocketDataType>,
  "fetch" | "websocket"
> & {
  fetch(request: Request, server: Server): Promise<Response> | Response;
  websocket?: WebSocketHandler<WebSocketDataType>;
}

export type LiveReloadOptions = {
  /**
   * URL path used for websocket connection
   * @default "__bun_live_reload_websocket__"
   */
  web_socket_path?: string;
}

function serve<
	WebSocketDataType,
	T extends PureWebSocketServeOptions<WebSocketDataType> & LiveReloadOptions
>(
	serveOptions: T,
): WebSocketServeOptions<WebSocketDataType> {

	const web_socket_path = serveOptions.web_socket_path ?? "__bun_live_reload_websocket__"

	const options : WebSocketServeOptions<WebSocketDataType> = {
		...serveOptions,
		fetch: async (req, server) => {
			const web_socket_url = server.hostname + ':' + server.port + '/' + web_socket_path

			if (req.url === 'http://' + web_socket_url) {
				const upgraded = server.upgrade(req)

				if (!upgraded)
					return new Response(
						"[server] Failed to upgrade websocket connection for live reload.",
						{ status: 500 }
					)
				return
			}

			const response = await serveOptions.fetch(req, server)

			if (!response.headers.get("Content-Type")?.includes("text/html"))
				return response

			const html = (await response.text()) + get_signature(web_socket_url)
			return new Response(html, response)
		},
		websocket: {
			...serveOptions.websocket,
			async message(ws, message) {
				console.log(`[server] Received ${message}`)
				await serveOptions.websocket?.message?.(ws, message)
			},
			async open (ws) {
				console.log(`[server] Opened ${ws}`)
				globalThis.web_socket = ws
				await serveOptions.websocket?.open?.(ws)
			},
		},
	}

	return options
}

export default serve
