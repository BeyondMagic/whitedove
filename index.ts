// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import { withHtmlLiveReload as Serve } from "bun-html-live-reload";
import root from "./source/html/root.html";
import css from "./distribution/main.css";

const SCSS = Bun.spawn([
	"sass",
	"--watch",
	"--no-source-map",
	"./source/scss/main.scss",
	"./distribution/main.css",
]);


export default Serve({
	port: 1984,
	hostname: "0.0.0.0",
	fetch: (req) => {
		const url = new URL(req.url);

		if (url.pathname === "/main.css")
			return new Response(Bun.file(css), {
				headers: { "Content-Type": "text/css" },
			});

		return new Response(Bun.file(root), {
			headers: { "Content-Type": "text/html" },
		});
	},
});
