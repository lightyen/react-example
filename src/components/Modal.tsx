import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { motion, AnimatePresence, Variants } from "framer-motion"
import tw, { css } from "twin.macro"

interface Props extends ModalContentProps {
	open?: boolean
	afterClose?: () => void
}

export default function Modal({
	children,
	open = false,
	exitAnime = true,
	afterClose,
	...rest
}: React.PropsWithChildren<Props>) {
	const root = document.getElementById("root")
	const modalRoot = document.getElementById("modal-root")
	const element = useRef(document.createElement("div"))
	const [visible, setVisible] = useState(open)

	function onExitComplete() {
		setVisible(false)
		modalRoot.style.bottom = ""
	}

	useEffect(() => {
		if (open) {
			setVisible(open)
		} else if (!exitAnime) {
			setVisible(false)
			modalRoot.style.bottom = ""
		}
	}, [open, modalRoot, exitAnime])

	const isOpen = useRef(false)
	useEffect(() => {
		if (isOpen.current && !visible && afterClose) {
			afterClose()
		}
		return () => {
			isOpen.current = visible
		}
	}, [afterClose, visible])

	useEffect(() => {
		const e = element.current
		function wheel(e: Event) {
			e.stopPropagation()
		}
		function keydown(e: KeyboardEvent) {
			e.preventDefault()
		}
		if (visible) {
			e.style.width = "100%"
			e.style.height = "100%"
			modalRoot.appendChild(e)
			modalRoot.style.bottom = "0%"
			modalRoot.addEventListener("wheel", wheel, { passive: true })
			root.addEventListener("keydown", keydown)
		}
		return () => {
			modalRoot.removeEventListener("wheel", wheel)
			root.removeEventListener("keydown", keydown)
			if (visible) {
				modalRoot.removeChild(e)
			}
		}
	}, [root, modalRoot, visible])

	return ReactDOM.createPortal(
		exitAnime ? (
			<AnimatePresence onExitComplete={onExitComplete}>
				{open && (
					<ModalContent exitAnime={exitAnime} {...rest}>
						{children}
					</ModalContent>
				)}
			</AnimatePresence>
		) : (
			open && (
				<ModalContent exitAnime={exitAnime} {...rest}>
					{children}
				</ModalContent>
			)
		),
		element.current,
	)
}

interface ModalContentProps {
	id?: string
	exitAnime?: boolean
	onMouseDownOutside?: (e: MouseEvent) => void
}

const container: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			when: "beforeChildren",
		},
	},
	exit: { opacity: 0 },
}

const modal: Variants = {
	hidden: { y: "5rem" },
	visible: { y: "10rem", transition: { ease: "backOut" } },
	exit: { y: "12rem", transition: { ease: "backIn" } },
}

const ModalContent = ({
	children,
	onMouseDownOutside,
	exitAnime,
	...props
}: React.PropsWithChildren<ModalContentProps>) => {
	const ref = useRef<HTMLDivElement>()
	useEffect(() => {
		const modal = ref.current
		function onMouseDown(e: MouseEvent) {
			if (!modal.contains(e.target as Node)) {
				onMouseDownOutside(e)
			}
		}
		window.addEventListener("mousedown", onMouseDown)
		return () => window.removeEventListener("mousedown", onMouseDown)
	}, [onMouseDownOutside])

	return (
		<motion.div
			tw="w-screen h-screen flex justify-center items-start"
			css={css`
				background-color: rgba(var(--theme-modal-cover-bg));
				backdrop-filter: blur(1px);
				z-index: 9999;
			`}
			variants={container}
			initial="hidden"
			animate="visible"
			exit={exitAnime ? "exit" : undefined}
		>
			<motion.div
				ref={ref}
				variants={modal}
				css={[
					tw`rounded`,
					css`
						background-color: rgb(var(--theme-surface));
						filter: drop-shadow(2px 2px 8px rgba(var(--theme-modal-shadow)));
					`,
				]}
				{...props}
			>
				{children}
			</motion.div>
		</motion.div>
	)
}
