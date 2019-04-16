const path = require('path')

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            { 
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                // options: {
                //     // 自己业务项目使用方式，按需引用
                //     // "presets": [["@babel/preset-env", {
                //     //     useBuiltIns: 'usage'
                //     // }]]
                //     // 第三方类库使用方式
                //     "plugins": [["@babel/plugin-transform-runtime", {
                //       "absoluteRuntime": false,
                //       "corejs": false,
                //       "helpers": true,
                //       "regenerator": true,
                //       "useESModules": false
                //     }]]
                // }
            }
        ]
    }
}