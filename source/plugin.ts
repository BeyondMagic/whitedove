type Key = {
	// The event itself.
	event : KeyboardEvent

	// The plugins to add when adding new content.
	plugins : Plugin[]
}

export type Keyboard = (key : Key) => void

export type Plugin = {
	// Function to be called upon 'onkeydown' event.
	onkeydown? : Keyboard

	// Function to be called upon 'onkeyup' event.
	// onkeyup? : Keyboard
}
