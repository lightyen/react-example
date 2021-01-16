import { merge } from "webpack-merge"

import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin"

import commonConfig from "./webpack.common"

export default merge(commonConfig, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		hot: true,
		compress: true,
		open: true,
		host: "localhost",
		clientLogLevel: "none",
		contentBase: false,
		noInfo: true,
		historyApiFallback: true,
	},
	stats: {
		children: false,
		modules: false,
		entrypoints: false,
	},
	plugins: [new ReactRefreshPlugin()],
})
