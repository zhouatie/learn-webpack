const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: './index.js',
    output: {
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8888'
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin()
    ]
}