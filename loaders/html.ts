// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import { plugin, file } from "bun";

plugin({
	name: "html",
	setup (build) {
		build.onLoad(
			{ filter: /\.(html)$/ },
			async ({ path }) => {
				return {
					exports: {
						default: await file(path).text(),
					},
					loader: 'object'
				}
			}
		)
	},
});
