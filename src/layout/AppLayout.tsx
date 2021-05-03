import { motion } from "framer-motion"
import { Redirect, RedirectProps, Route, RouteProps, Switch } from "react-router-dom"
import Page404 from "~/pages/404"
import Login from "~/pages/Login"
import AppMain from "./AppMain"
import Header from "./Header"
import Sidebar from "./Sidebar"

function MotionRedirect({ children, ...props }: React.PropsWithChildren<RedirectProps>) {
	return (
		<motion.div exit="undefined">
			<Redirect {...props} />
		</motion.div>
	)
}

function isAuthenticated(): boolean {
	return true // try get localstorage token
}

function AuthenticatedRoute({ children, ...rest }: React.PropsWithChildren<RouteProps>) {
	return <Route {...rest}>{isAuthenticated() ? children : <MotionRedirect to="/login" />}</Route>
}

function NoAuthenticatedRoute({ children, ...rest }: React.PropsWithChildren<RouteProps>) {
	return <Route {...rest}>{!isAuthenticated() ? children : <MotionRedirect to="/" />}</Route>
}

function Layout() {
	const h = 45
	const w = 246
	return (
		<div tw="h-screen flex flex-col relative">
			<Header height={h} />
			<Sidebar top={h} width={w} />
			<AppMain headerHeight={h} sidebarWidth={w} />
		</div>
	)
}

export default function AppSwitch() {
	return (
		<Switch>
			<Route path="/404" exact>
				<Page404 />
			</Route>
			<NoAuthenticatedRoute path="/login" exact>
				<Login />
			</NoAuthenticatedRoute>
			<AuthenticatedRoute path="/">
				<Layout />
			</AuthenticatedRoute>
		</Switch>
	)
}
