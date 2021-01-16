import { useEffect, useRef } from "react"

export function useRipple<T extends HTMLElement>() {
	const ref = useRef<T>()
	useEffect(() => {
		const el = ref.current

		function ripple(el: HTMLElement, e: MouseEvent) {
			const c = document.createElement("div")
			c.addEventListener(
				"transitionend",
				() => {
					try {
						el.removeChild(c)
					} catch {}
				},
				false,
			)
			c.classList.add("ripple-circle")
			el.appendChild(c)

			const rect = el.getBoundingClientRect()
			const d = Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) * 2
			c.style.cssText = `--scale: 0.05; --opacity: 1;`
			c.clientTop
			// NOTE: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
			c.style.cssText = `--t: 0.37;
			--opacity: 0; --d: ${d};
			--x:${e.pageX - rect.left};
			--y:${e.pageY - rect.top};`
		}
		const mousedown = (e: MouseEvent) => ripple(el, e)
		el.addEventListener("mousedown", mousedown)
		return () => {
			el.removeEventListener("mousedown", mousedown)
		}
	}, [])
	return ref
}
