//export type Parameter<Kind> = {
//	// The event itself.
//	event : Kind
//
//	// The plugins to add when adding new content.
//	plugins : Array<Plugin>
//}
//
//export type Caller<Kind> = (key : Parameter<Kind>) => void

export type Kind<K extends keyof HTMLElementEventMap> = {
	type: K
	listener: (this: HTMLAnchorElement, ev : HTMLElementEventMap[K]) => any
	options?: boolean | AddEventListenerOptions | undefined
}

type VerifyKind<T> = unknown extends
	(T extends { type: infer A extends keyof HTMLElementEventMap, listener: (this: HTMLAnchorElement, ev : HTMLElementEventMap[infer B extends keyof HTMLElementEventMap]) => any, options?: boolean | AddEventListenerOptions | undefined } ?
	T extends { type: A, ev: HTMLElementEventMap[B] } ? never : unknown : unknown ) ? never : unknown

export type Plugin<T extends Kind<any>> = {
	events: Array<T> & VerifyKind<T>
}
