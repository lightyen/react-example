import { motion } from "framer-motion"
import { Route, Redirect } from "react-router-dom"
import type { RouteProps, RedirectProps } from "react-router-dom"
import "twin.macro"

export const MotionRoute = ({ component, ...props }: Omit<RouteProps, "children">) => {
	const Component = component as React.ComponentType
	return (
		<Route {...props}>
			<motion.div
				tw="flex-grow h-full"
				initial={{ opacity: 0, x: "1rem" }}
				animate={{ opacity: 1, x: 0, transition: { duration: 0.15, ease: "easeInOut" } }}
				exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeInOut" } }}
			>
				<Component />
			</motion.div>
		</Route>
	)
}

export const MotionRedirect = ({ ...props }: Omit<RedirectProps, "children">) => (
	<motion.div exit="undefined">
		<Redirect {...props} />
	</motion.div>
)
