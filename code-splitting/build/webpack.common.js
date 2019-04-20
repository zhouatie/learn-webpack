const path = require('path')

module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/test1.js'),
        test: path.resolve(__dirname, '../src/test2.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1000,
            minChunks: 2,
            maxAsyncRequests: 1,
            cacheGroups: {
                // 下面的意思是：将从node_modules中引入的模块统一打包到一个vendors.js文件中
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: 'vendors.js'
                },
                // default: false
                // 打包除上面vendors以外的公共模块
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                    filename: 'common.js'
                }
            }
        }
    }
}