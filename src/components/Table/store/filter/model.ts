import { Styles } from "react-select"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FilterType<T = unknown, V = any> = PatternFilter<T> | SelectFilterSingle<T, V> | SelectFilterMulti<T, V>

export type Filter<T> = (text: string, record: T) => boolean

export interface PatternFilter<T> {
	fid?: string
	type: "pattern"
	label: string
	filter: (value: string, record: T) => boolean
}

export interface SelectOptionStyle {
	color?: string
}

export interface SelectOption<Value> extends SelectOptionStyle {
	label: string
	value: Value
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionValueType<T> = T extends { label: string; value: infer T } ? T : never

export interface SelectFilterSingle<T, V> {
	fid?: string
	/** react-select styles */
	styles?: Partial<Styles>
	isMulti?: false
	type: "select"
	label: string
	filterOptions?: Array<SelectOption<V>>
	filter: (value: OptionValueType<SelectOption<V>>, record: T) => boolean
}

export interface SelectFilterMulti<T, V> {
	fid?: string
	/** react-select styles */
	styles?: Partial<Styles>
	isMulti: true
	type: "select"
	label: string
	filterOptions?: Array<SelectOption<V>>
	filter: (value: Array<OptionValueType<SelectOption<V>>>, record: T) => boolean
}
