// Procedure: returns Selection object and throws error if fails.
export function get() {
	const selection = window.getSelection()
	if (!selection)
		throw Error("Not found selection!")
	return selection
}
