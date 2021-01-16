import { forwardRef, useRef, useState } from "react"
import tw, { styled } from "twin.macro"
import { v4 } from "uuid"
import { FormattedMessage } from "react-intl"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload"

const InputFile = styled.input`
	display: none;
`

const Label = styled.label`
	${tw`inline-flex items-center justify-center w-full px-4 py-2`}
	${tw`cursor-pointer select-none transition duration-200!`}
`

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">

export default forwardRef<HTMLInputElement, Props>(({ onChange, ...props }, ref) => {
	const id = useRef(v4()).current
	const [file, setFile] = useState<File>()
	return (
		<>
			<InputFile
				type="file"
				ref={ref}
				onChange={e => {
					const files = e.target.files
					if (files && files.length > 0) setFile(files[0])
				}}
				id={id}
				{...props}
			/>
			<Label htmlFor={id} {...((props as unknown) as React.LabelHTMLAttributes<HTMLLabelElement>)}>
				<FontAwesomeIcon icon={faUpload} />
				<span tw="px-3">{file ? file.name : <FormattedMessage id="upload_file" />}</span>
			</Label>
		</>
	)
})
