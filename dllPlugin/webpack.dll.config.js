const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        vendor: ['jquery', 'lodash'] // 要打包进vendor的第三方库
    },
    output: {
        filename: '[name].dll.js', // 打包后的文件名
        path: path.resolve(__dirname, './dll'), // 打包后存储的位置
        library: '[name]_[hash]' // 挂载到全局变量的变量名，这里要注意 这里的library一定要与DllPlugin中的name一致
    },
    plugins: [
        new webpack.DllPlugin({ // 用于打包出一个个单独的动态链接库文件
            name: '[name]_[hash]', // 引用output打包出的模块变量名，切记这里必须与output.library一致
            path: path.join(__dirname, './dll', '[name].manifest.json') // 描述动态链接库的 manifest.json 文件输出时的文件名称
        })
    ]
}