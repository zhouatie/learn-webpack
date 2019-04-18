const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const devConfig = {
    mode: "development",
    // entry: '../src/test1.js',
    entry: {
        main: path.resolve(__dirname, '../src/test1.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}

module.exports = devConfig