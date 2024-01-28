// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import type { ServerWebSocket } from "bun";

declare global {
	// biome-ignore lint/style/noVar: Typescript only respects var for global.
	var web_socket: ServerWebSocket<unknown> | undefined;

	// biome-ignore lint/style/noVar: ^
	var web_socket_command: string;
}
