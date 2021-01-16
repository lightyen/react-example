import { BrowserRouter, RouteProps, RedirectProps, Redirect, Route, Switch } from "react-router-dom"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Header from "./Header"
import AppMain from "./AppMain"
import Login from "~/pages/Login"
import Page404 from "~/pages/404"

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

function AppLayout() {
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

function AppRouter() {
	return (
		<Switch>
			<Route path="/404" exact>
				<Page404 />
			</Route>
			<NoAuthenticatedRoute path="/login" exact>
				<Login />
			</NoAuthenticatedRoute>
			<AuthenticatedRoute path="/">
				<AppLayout />
			</AuthenticatedRoute>
		</Switch>
	)
}

export default function Router() {
	return (
		<BrowserRouter>
			<AppRouter />
		</BrowserRouter>
	)
}
