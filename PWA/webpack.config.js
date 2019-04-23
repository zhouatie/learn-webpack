const {GenerateSW} = require('workbox-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
        new GenerateSW({
            skipWaiting: true, // 强制等待中的 Service Worker 被激活
            clientsClaim: true // Service Worker 被激活后使其立即获得页面控制权
        })
    ]
}