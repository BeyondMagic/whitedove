// João Farias © 2024 BeyondMagic <beyondmagic@mail.ru>

import { plugin, file } from "bun";

plugin({
	name: "html",
	setup (build) {
		build.onLoad(
			{ filter: /\.(html)$/ },
			async ({ path }) => {
				const contents =
					'const text = `' + await file(path).text() + '`;' +
					'export default text;'

				return {
					contents,
					loader: 'ts',
				}
			}
		)
	},
});
