const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    // entry: './main.js',
    // output: {
    //     filename: 'main.js',
    // },
    entry: './index.js',
    output: {
        filename: 'library.js',
        library: 'library',
        libraryTarget: 'umd'
    },
    externals: {
        // 前面的lodash是我的库里引入的包名 比如 import _ from 'lodash'
        // 后面的lodash是别人业务代码需要注入到他自己模块的lodash 比如 import lodash from 'lodash',注意不能import _ from 'lodash',因为配置项写了lodash 就不能import _
        lodash: 'lodash'
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // },
    // plugins: [
    //     // new HtmlWebpackPlugin({
    //     //     template: './index.html'
    //     // }),
    //     new cleanWebpackPlugin()
    // ]
}