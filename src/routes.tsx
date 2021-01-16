import { lazy } from "react"
import { FormattedMessage } from "react-intl"
import { RouteProps } from "react-router-dom"

interface RouteItem extends RouteProps {
	name: React.ReactNode
}

export const routes: RouteItem[] = [
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

export function getRouteName(url: string): React.ReactNode {
	const r = routes.find(i => i.path === url)
	if (r) {
		return r.name
	}
	const u = new URL(url)
	return u.pathname
}
