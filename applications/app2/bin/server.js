const http = require("http");
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const history = require("connect-history-api-fallback");

const { dev: configDev } = require("../webpack.config.js");
const PUBLIC_PATH = path.resolve(__dirname, "../dist");
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === "development";

const app = express();
const server = http.createServer(app);

if (isDevelopment) {
	const compiler = webpack(configDev);
	app.use(
		history(),
		webpackDevMiddleware(compiler, configDev.devServer),
		webpackHotMiddleware(compiler)
	);
} else {
	app.use(express.static(PUBLIC_PATH));
	// @note: redirect all incoming request to index.html in order to handle
	// history fallback given SPA client side routing
	app.use("*", (req, res) => {
		res.sendFile(path.resolve(PUBLIC_PATH, "index.html"));
	});
}

server.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
