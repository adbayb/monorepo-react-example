const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

// @note: It's important to set "sideEffects": false (introduced in Webpack 4) entry to
// each core package's package.json (eg. lego, transformers...)
// to avoid include to the bundle some unused modules from the entry point of
// a given core package since, According to the EcmaScript spec, all child
// modules must be evaluated because they could contain side effects.
// The "sideEffects": false flag indicates that the package's modules have no side effects
// allowing Webpack to optimize re-exports by removing unused exports.
// @see: for more explanations: https://github.com/webpack/webpack/blob/master/examples/side-effects/README.md
const include = [
	fs.realpathSync(path.resolve(__dirname, "src")),
	fs.realpathSync(path.resolve(__dirname, "node_modules/@adbayb/shared"))
];

const common = {
	context: __dirname, // @note: The base directory, an absolute path, for resolving entry points and loaders from configuration.
	entry: { app: "./src/index.js" },
	output: {
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					// @note: we define babel config here instead of .babelrc file
					// since there is an issue with linked node module in monorepo
					// @see: https://github.com/webpack/webpack/issues/6799#issuecomment-374523938
					options: {
						cacheDirectory: true,
						...JSON.parse(
							fs.readFileSync(
								path.resolve(__dirname, ".babelrc"),
								"utf8"
							)
						)
					}
				}
			}
		]
	},
	plugins: [
		new CaseSensitivePathsPlugin(),
		new HtmlPlugin({
			template: "src/index.html",
			filename: "index.html"
		})
	],
	resolve: {
		alias: {
			// @note: externals to allow consuming packages independently regarding require algorithm resolution:
			react: path.resolve(__dirname, "node_modules/react"),
			"react-dom": path.resolve(__dirname, "node_modules/react-dom")
		},
		symlinks: true
	}
};

module.exports = {
	dev: {
		...common,
		mode: "development",
		devtool: "cheap-module-eval-source-map",
		entry: {
			app: [
				"webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
				common.entry.app
			]
		},
		plugins: [
			...common.plugins,
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.DefinePlugin({
				DEV: true
			})
		],
		devServer: {
			stats: "minimal"
		}
	},
	prod: {
		...common,
		mode: "production",
		output: {
			...common.output,
			filename: "[name].[chunkhash].js"
		},
		plugins: [
			...common.plugins,
			new webpack.DefinePlugin({
				DEV: false
			})
		]
	}
};
