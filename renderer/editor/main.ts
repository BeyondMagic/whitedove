import { create } from "../../source/main"

if (typeof window !== 'undefined') {
	document.addEventListener('DOMContentLoaded', () => {
		document.body.append(create())
	})
}
