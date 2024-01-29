export type Parameter<Kind> = {
	// The event itself.
	event : Kind

	// The plugins to add when adding new content.
	plugins : Plugin[]
}

export type Caller<Kind> = (key : Parameter<Kind>) => void

export type Plugin = {
	keydown? : Caller<KeyboardEvent>

	mouseup? : Caller<MouseEvent>
	selectstart? : Caller<Event>
	selectionchange? : Caller<Event>
}
