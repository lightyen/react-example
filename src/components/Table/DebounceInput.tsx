import { useRef, useState, useCallback, useEffect, forwardRef } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
	const handle = useRef<number>()
	return useCallback(
		(...args: Parameters<T>) => {
			window.clearTimeout(handle.current)
			handle.current = window.setTimeout(() => callback(...args), delay)
		},
		[callback, delay],
	)
}

interface ExtendProps {
	timeout?: number
	onChange?: (value: string) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, value: string) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>, value: string) => void
}

export const DebounceInput = forwardRef<
	HTMLInputElement,
	ExtendProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onKeyDown" | "onBlur">
>((props, ref) => {
	const { timeout, onChange, onKeyDown, onBlur, value, defaultValue, ...rest } = props
	const [text, setText] = useState<string>((defaultValue as string) || "")

	const debounceChange = useDebounce(onChange, timeout)

	// restore when props receive
	useEffect(() => {
		if (props.defaultValue != undefined) {
			setText(props.defaultValue as string)
		}
	}, [props])

	return (
		<input
			ref={ref}
			{...rest}
			value={text}
			onChange={e => {
				setText(e.target.value)
				onChange && debounceChange(e.target.value)
			}}
			onKeyDown={e => {
				onKeyDown && onKeyDown(e, text)
			}}
			onBlur={e => {
				onBlur && onBlur(e, text)
			}}
		/>
	)
})
