const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    // mode: 'production',
    mode: 'development',
    devServer: {
        port: 8888,
        open: true,
        contentBase: './dist'
    },
    entry: './index.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin()
    ]
}