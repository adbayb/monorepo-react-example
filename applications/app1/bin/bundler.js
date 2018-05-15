const webpack = require("webpack");
const { prod: configProd } = require("../webpack.config.js");

const compiler = webpack(configProd);

compiler.run((err, stats) => {
	if (err) {
		console.error(err.message);
	}

	console.log(
		stats.toString({
			colors: true
		})
	);
});
