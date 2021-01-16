export function keys<T>(instance: T) {
	return Object.keys(instance) as Array<keyof T>
}

export function entries<T>(instance: T) {
	return Object.entries(instance) as Array<[keyof T, T[keyof T]]>
}
