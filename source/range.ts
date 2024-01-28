// Function: Will save all ranges of a given selection and return a array of their latest state.
export function save(selection : Selection) {
	const ranges : Array<Range> = []
	for (let i = 0; i < selection.rangeCount; ++i)
		ranges.push(selection.getRangeAt(i))

	return ranges
}

// Procedure: Will restore given ranges to a given selection.
export function restore(selection : Selection, ranges : Array<Range>) {
	selection.removeAllRanges()

	// To support unusual Firefox behavior around a mix of selections
	// inside and outside tables, restore ranges whose start container
	// is TR first, then others
	for (const range of ranges.filter(({startContainer: {nodeName}}) => nodeName === "TR"))
		selection.addRange(range)

	for (const range of ranges.filter(({startContainer: {nodeName}}) => nodeName !== "TR"))
		selection.addRange(range)
}
