var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'message-bus-async.js',
        library: ["MessageBusAsync"],
        libraryTarget: "umd"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            enforce: 'pre',
            loader: 'tslint-loader',
            options: {
                typeCheck: true
            },
            exclude: /(node_modules|dist|test)/,
        }, {
            test: /\.tsx?$/,
            use: [{
                loader: "ts-loader",
                options: {
                    exclude: /(node_modules|dist|test)/
                }
            }]
        }]
    },
    resolve: {
        extensions: [".ts", ".tsx"]
    },
    externals: [],
    node: { Buffer: false },
    plugins: []
}