const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.bundle.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js"],
    },
    module: {},
    plugins: [new CleanWebpackPlugin()],
}
