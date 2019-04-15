### npm

`npm info webpack` 查看webpack的历史版本信息等

`npm init -y` 跳过那些选项，默认



全局安装的webpack  ： webpack index.js 打包

local安装的webpack： npx webpack index.js 打包

script中脚本打包 ： npm run build



webpack4设置mode：production 会压缩代码 development 就不压缩代码

打包 output里面[name].js loader中的name变量 其实就是entry:{main: index.js} 中的key =》 main



### source-map

devtool: source-map

`source-map` dist文件夹里会多生成个map后缀文件，这样页面报错的时候，点击报错后面的地址，会跳转到代码写的地方。而不会跳转到打包后的代码里。

`inline-source-map`: 不会新生成.map文件，会插入到打包的文件底部

`cheap-inline-source-map`:  因为liline-source-map报错会告诉你第几行第几个字符。前面加上cheap的话 只会告诉你第几行

`cheap-module-inline-source-map`: 本来map只会映射打包出来的index.js跟业务代码中的关系。第三方引入库报错映射不到。中间加了module这个参数就可以了。

开发的时候建议使用：`cheap-module-eval-source-map`

一般`development`环境用 `cheap-module-eval-source-map`

`production`环境用`cheap-module-source-map`



### loader

import style from './index.css'

style-loader 的options 添加modules ：true

dom.classList.add(style.avatar) 可以让这个dom独立拥有这个样式

loader执行顺序是从下到上，右到左。



### webpack-dev-server

##### webpack-dev-server

`webpack —watch`页面会刷新下，内容会自动更新

`webpack-dev-server`会自动更新当前页面

`webpack-dev-server`, 现在的`webpack-dev-server`比以前好多了 vue-cli3 和react都是用这个了

```javascript
devServer: {
	contentBase: './dist', // 有这个就够了，
	open: true, // 自动打开浏览器
  port: 8080, // 端口不必填
  proxy: {'/api': http://localhost:3000}
}
```

##### 启动服务来热更新

`npm install express webpack-dev-middleware -D`

在output中添加publicPath

```javascript
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleWare = require('webpack-dev-middleware')
const config = require('./webpack.config.js')
const complier = webpack(config) // 帮我们做编译的东西，webpack传入config之后会申请一个编译器

app.use(webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath, // 意思是只要文件改变了，就重新运行 
}))

const app = express()

app.listen(3000, () => {
  console.log('server is running 3000')
})
```

> 现在这样子写太麻烦了（vue-cli2也是如此）。因为以前版本`webpack-dev-server`还不够强大，现在不一样了。非常的强大了。

