import { useState, useEffect, forwardRef } from "react"

interface ExtendProps {
	onChange?: (value: string) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

export const NormalInput = forwardRef<
	HTMLInputElement,
	ExtendProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onKeyDown" | "onBlur">
>((props, ref) => {
	const { onChange, onKeyDown, onBlur, value, defaultValue, ...rest } = props

	const [inputValue, setInputValue] = useState<number | string | readonly string[]>(value || defaultValue || "")

	// restore when props changed
	useEffect(() => {
		const new_value = props.value || props.defaultValue || ""
		setInputValue(new_value)
	}, [props])

	return (
		<input
			{...rest}
			ref={ref}
			value={inputValue}
			onChange={e => {
				setInputValue(e.target.value)
				onChange && onChange(e.target.value)
			}}
			onKeyDown={e => {
				onKeyDown && onKeyDown(e)
			}}
			onBlur={e => {
				onBlur && onBlur(e)
			}}
		/>
	)
})
