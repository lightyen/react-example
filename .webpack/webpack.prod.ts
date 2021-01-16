import { merge } from "webpack-merge"
import path from "path"

import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import ESLintPlugin from "eslint-webpack-plugin"

import commonConfig from "./webpack.common"

const workspaceFolder = path.resolve(__dirname, "..")

export default merge(commonConfig, {
	mode: "production",
	devtool: "source-map",
	optimization: {
		minimize: true,
		minimizer: ["...", new CssMinimizerPlugin()],
	},
	plugins: [new ESLintPlugin({ context: path.join(workspaceFolder, "src"), extensions: ["js", "jsx", "ts", "tsx"] })],
})
