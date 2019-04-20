const CleanWebpackPlugin = require('clean-webpack-plugin')
const commonConfig = require('./webpack.common.js')
const merge = require('webpack-merge')

const devConfig = {
    mode: "development",
    // entry: '../src/test1.js',
    plugins: [
        new CleanWebpackPlugin()
    ]
}

module.exports = merge(commonConfig, devConfig)