const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new webpack.DllReferencePlugin({
            manifest: require('./dll/vendor.manifest.json')
        }),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, './dll/vendor.dll.js')
        })
    ]
}