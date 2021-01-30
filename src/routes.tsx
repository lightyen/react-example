import { lazy } from "react"
import { FormattedMessage } from "react-intl"
import { RouteProps } from "react-router"

export type RouteName = React.ReactNode

interface RouteConfig extends RouteProps {
	name: RouteName
}

export const routes: RouteConfig[] = [
	{
		path: "/",
		exact: true,
		component: lazy(() => import("~/views/Home")),
		name: <FormattedMessage id="home" />,
	},
	{
		path: "/components",
		component: lazy(() => import("~/views/Components")),
		name: <FormattedMessage id="nav_components" />,
	},
	{
		path: "/virtual-list",
		component: lazy(() => import("~/views/VirtualList")),
		name: <FormattedMessage id="nav_virtual_list" />,
	},
	{ path: "/table", component: lazy(() => import("~/views/Table")), name: <FormattedMessage id="nav_table" /> },
	{
		path: "/transition",
		component: lazy(() => import("~/views/Transition")),
		name: <FormattedMessage id="nav_transition" />,
	},
	{
		path: "/web-component",
		component: lazy(() => import("~/views/WebComponent")),
		name: <FormattedMessage defaultMessage="Web Components" />,
	},
	{
		path: "/codemirror",
		component: lazy(() => import("~/views/Editor")),
		name: <FormattedMessage id="nav_editor" />,
	},
	{
		path: "/carousel",
		component: lazy(() => import("~/views/Carousel")),
		name: <FormattedMessage id="nav_carousel" />,
	},
	{
		path: "/color-picker",
		component: lazy(() => import("~/views/ColorPicker")),
		name: <FormattedMessage id="nav_color_picker" />,
	},
]

export function getRouteName(url: string): RouteName {
	const match = routes.find(route => {
		if (route.strict) {
			return route.path === url
		}

		if (route.path instanceof Array) {
			return route.path.some(p => url.startsWith(p))
		}

		return url.startsWith(route.path)
	})

	if (match) {
		return match.name
	}

	return new URL(url).pathname
}

export function getBreadcrumbs(url: string): RouteName[] {
	const names: React.ReactNode[] = []

	return names
}
