import { forwardRef, useRef, useEffect, useImperativeHandle } from "react"

import { fromTextArea, on, off } from "codemirror"
import type { Editor, EditorConfiguration, EditorFromTextArea, Doc, EditorChange } from "codemirror"

import "codemirror/addon/comment/comment"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/continuelist"

// highlights
import "codemirror/mode/markdown/markdown"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/jsx/jsx"
import "codemirror/mode/go/go"
import "codemirror/mode/sass/sass"
import "codemirror/mode/css/css"

import Page from "~/components/Page"
import { FormattedMessage } from "react-intl"

import "codemirror/lib/codemirror.css"
import "codemirror/theme/dracula.css"

import { Global } from "@emotion/react"
import tw, { css } from "twin.macro"

const globalStyle = css`
	.CodeMirror {
		font-family: Fira Code, Roboto, Helvetica Neue, Helvetica, Arial, PingFang TC, 黑體-繁, Heiti TC, 蘋果儷中黑,
			Apple LiGothic Medium, 微軟正黑體, Microsoft JhengHei, sans-serif !important;
		${tw`bg-gray-300 text-gray-900 h-auto text-base`}
	}

	.CodeMirror-selected {
		/* background: #96dfcf !important; */
	}

	.CodeMirror-lines {
		/* ${tw`p-0`} */
	}

	.CodeMirror pre.CodeMirror-line,
	.CodeMirror pre.CodeMirror-line-like {
		${tw`px-2`}
	}

	.cm-tab {
		position: relative;
	}
	.cm-tab::before {
		content: "";
		height: 100%;
		position: absolute;
		border-right: 1px solid #424242;
	}
	.cm-tab::after {
		position: absolute;
		left: 2px;
		content: "→";
		color: #424242;
	}
`

interface MyProps {
	options?: EditorConfiguration
	onChange?: (value: string) => void
}

type Textarea = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">
type Props = Textarea & MyProps

const CodeMirror = forwardRef<Editor, Props>(({ options, onChange, ...props }, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement>()
	const editorRef = useRef<EditorFromTextArea>()
	useImperativeHandle<Partial<Editor>, Partial<Editor>>(ref, () => ({
		focus: () => editorRef.current.focus(),
	}))
	useEffect(() => {
		editorRef.current = fromTextArea(textareaRef.current, options)
		editorRef.current.setSize("auto", 600)
		return () => {
			editorRef.current.toTextArea()
		}
	}, [options])

	useEffect(() => {
		const cm = editorRef.current
		const handler = (instance: Doc, changeArgs: EditorChange) => {
			onChange(cm.getValue())
		}
		if (onChange) {
			on(cm.getDoc(), "change", handler)
		}
		return () => {
			if (onChange) {
				off(cm.getDoc(), "change", handler)
			}
		}
	}, [onChange])

	return (
		<>
			<Global styles={globalStyle} />
			<div>
				<textarea
					ref={textareaRef}
					{...props}
					onChange={e => {
						// no code
					}}
				/>
			</div>
		</>
	)
})

const EditorPage = () => {
	const ref = useRef<Editor>()

	const cache = useRef(
		`# Test

code

\`\`\`tsx
const Card = () => {
    return (
        <div>Card</div>
    )
}
\`\`\`
`,
	)

	return (
		<Page>
			<h2 tw="text-3xl mt-8 mb-2 font-black capitalize">
				<FormattedMessage id="nav_editor" />
			</h2>
			<CodeMirror
				ref={ref}
				options={{
					lineNumbers: true,
					mode: "markdown",
					theme: "dracula",
					extraKeys: {
						Enter: "newlineAndIndentContinueMarkdownList",
						Tab: function (cm) {
							cm.replaceSelection(Array(cm.getOption("tabSize")).join(" "))
						},
						"Ctrl-/": "toggleComment",
						"Ctrl-S": function (cm) {
							// no code
						},
					},
					indentWithTabs: true,
					indentUnit: 4,
					autoCloseTags: true,
					autoCloseBrackets: true,
					autofocus: true,
				}}
				defaultValue={cache.current}
				onChange={e => (cache.current = e)}
			/>
		</Page>
	)
}

export default EditorPage
