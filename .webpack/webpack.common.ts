import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin"
import glob from "glob"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import TsPathsResolvePlugin from "ts-paths-resolve-plugin"
import type { Configuration } from "webpack"
import { EnvironmentPlugin } from "webpack"
import WebpackBar from "webpackbar"

const workspaceFolder = path.resolve(__dirname, "..")
const isDev = process.env.NODE_ENV !== "production"
const outputCSS = "css"
const outputJS = "js"
const publicPath = "/"

const join = (...args: string[]) => path.join(...args).replace(path.sep, "/")

const entry: Configuration["entry"] = glob
	.sync("index.*", { cwd: path.resolve(workspaceFolder, "src") })
	.map(i => path.resolve(workspaceFolder, "src", i))

const styleLoader = {
	loader: isDev ? "style-loader" : MiniCssExtractPlugin.loader,
	options: {
		...(!isDev && { publicPath: path.relative(path.join(publicPath, outputCSS), publicPath) }),
	},
}

const config: Configuration = {
	target: "web",
	entry,
	output: {
		path: path.resolve(workspaceFolder, "build"),
		filename: join(outputJS, "[name].js?[fullhash]"),
		chunkFilename: join(outputJS, "[name].js?.[fullhash:8]"),
		publicPath,
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
		plugins: [new TsPathsResolvePlugin({ tsConfigPath: path.join(workspaceFolder, "src", "tsconfig.json") })],
	},
	// resolveLoader: {
	// 	alias: {
	// 		"custom-loader": path.resolve(__dirname, "loaders", "custom-loader.ts"),
	// 	},
	// },
	module: {
		rules: [
			// {
			// 	test: /\.tsx?$/,
			// 	exclude: /node_modules|__tests?__|\.test\.tsx?$|\.worker\.ts$/,
			// 	use: [
			// 		"babel-loader",
			// 		{
			// 			loader: "ts-loader",
			// 			options: { context: path.join(workspaceFolder, "src"), happyPackMode: true },
			// 		},
			// 	],
			// },
			{
				test: /\.(j|t)sx?$/,
				exclude: /node_modules|__tests?__|\.test\.(j|t)sx?$|\.worker\.(j|t)s$/,
				use: ["babel-loader"],
			},
			// {
			// 	test: /\.worker\.ts$/,
			// 	exclude: /node_modules/,
			// 	use: ["worker-loader", "babel-loader", { loader: "ts-loader", options: { happyPackMode: true } }],
			// },
			{
				test: /\.worker\.(j|t)s$/,
				exclude: /node_modules/,
				use: ["worker-loader", "babel-loader"],
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					styleLoader,
					{
						loader: "css-loader",
						options: {
							url: true,
							sourceMap: true,
						},
					},
					"postcss-loader",
				],
			},
			{
				include: /node_modules/,
				test: /\.css$/,
				use: [styleLoader, "css-loader"],
			},
			{
				test: /\.(png|jpe?g|gif|ico)(\?.*)?$/i,
				use: [
					{
						loader: "url-loader",
						options: {
							name: join("images", "[name].[ext]?[contenthash]"),
							limit: 8192,
						},
					},
				],
			},
			{
				test: /\.svg$/,
				use: ["babel-loader", "@svgr/webpack"],
			},
			{
				test: /\.ya?ml$/,
				use: "js-yaml-loader",
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							name: join("fonts", "[name].[ext]?[contenthash]"),
						},
					},
				],
			},
		],
	},
	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: process.env.NODE_ENV,
		}),
		new HtmlWebpackPlugin({
			title: "React App",
			inject: true,
			minify: true,
			template: path.join(workspaceFolder, "public", "index.ejs"),
			favicon: path.join(workspaceFolder, "public", "favicon.ico"),
			isDev,
		}),
		new ForkTsCheckerPlugin({
			typescript: {
				configFile: path.resolve(workspaceFolder, "src", "tsconfig.json"),
			},
		}),
		new MiniCssExtractPlugin({
			filename: join(outputCSS, "[name].css?[fullhash]"),
			chunkFilename: join(outputCSS, "[name].chunk.css?[fullhash:8]"),
		}),
		new WebpackBar({ color: "blue", name: "React" }),
	],
}

export default config
