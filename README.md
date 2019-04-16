### npm

`npm info webpack` 查看webpack的历史版本信息等

`npm init -y` 跳过那些选项，默认



全局安装的webpack  ： webpack index.js 打包

local安装的webpack： npx webpack index.js 打包

script中脚本打包 ： npm run build

命令行中打包：`npx webpack index.js -o bundle.js` 入口是`index.js`, 出口是`bundle.js`

webpack4设置mode：production 会压缩代码 development 就不压缩代码

打包 output里面[name].js loader中的name变量 其实就是entry:{main: index.js} 中的key =》 main



### source-map

devtool: source-map

`source-map` dist文件夹里会多生成个map后缀文件，这样页面报错的时候，点击报错后面的地址，会跳转到代码写的地方。而不会跳转到打包后的代码里。

`inline-source-map`: 不会新生成.map文件，会插入到打包的文件底部

`cheap-inline-source-map`:  因为`inline-source-map`报错会告诉你第几行第几个字符。前面加上cheap的话 只会告诉你第几行

`cheap-module-inline-source-map`: 本来map只会映射打包出来的index.js跟业务代码中的关系。第三方引入库报错映射不到。中间加了module这个参数就可以了。比如`loader`也会有`source-map`

开发的时候建议使用：`cheap-module-eval-source-map`,`eval`表示不会独立生成map文件，而是打包进代码里。

一般`development`环境用 `cheap-module-eval-source-map`

`production`环境用`cheap-module-source-map`



### loader

`import style from './index.css'`

`style-loader` 的`options` 添加`modules ：true`

`dom.classList.add(style.avatar)` 可以让这个dom独立拥有这个样式

loader执行顺序是从下到上，右到左。



### webpack-dev-server

##### webpack-dev-server

> `webpack-dev-server`会对你的代码进行打包，将打包的内容放到内存里面，并不会自动给你打包放进dist里。

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



### Hot Module Replacement

> 热替换，就是不会刷新整个页面。当不使用热更新的时候，操作一些功能，新增了三个元素，修改样式页面自动刷新后，刚才新增的元素会消失。如果开启了热替换，那么原先的dom会还在。

```javascript
const webpack = require('webpack')
	// ....
  devServer: {
    contentBase: './dist',
      open: true,
      hot: true,
      hotOnly: true // 以防hot失效后，页面被刷新，使用这个，hot失效也不刷新页面
  },
  // ...
  plugins: [
     new webpack.HotModuleReplacementPlugin()
  ]
```

```javascript
import number from './number.js'

if (module.hot) { // 如果热更新存在
 	// 监听的文件改变，会触发后面的回调方法
  module.hot.accept('./number', () => {
    // dosomething
  })
}
```

> 为什么修改了css文件不需要写module.hot。而写js需要写呢，因为css-loader已经自动帮你处理了。



### babel

#### 基本用法

将高版本的js代码转换成低版本的js代码。比如ie浏览器不兼容es6，需要使用babel把es6代码把js转换成低版本的js代码。

安装：`npm install --save-dev babel-loader @babel/core`

```javascript
module: {
  rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ]
}
```

`babel-loader`并不会帮助你把es6语法转换成低级的语法。它只是帮助打通webpack跟babel之间的联系。



转换成es5的语法：

安装：`npm install @babel/preset-env --save-dev`

`@babel/preset-env`包含了es6转换成es5的所有规则。

```javascript
module: {
  rules: [
    { 
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        "presets": ["@babel/preset-env"]
      }
    }
  ]
}
```



如果还需要降到更低版本就得使用`babel-polyfill`

安装：`npm install --save @babel/polyfill`

页面顶部引入`import "@babel/polyfill";`就可以将高级版本语法转换成低级语法。但是直接`import`会让打包后的文件非常大。

这个时候就需要再配置`webpack.config.js`

**useBuiltIns**

```javascript
{ 
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
    		// "presets": ["@babel/preset-env"]
        // 当你做babel-polyfill往浏览器填充的时候，根据业务代码用到什么加什么，并不会全部写入,
      	// 数组中，后面的对象是对数组前面的babel做配置
        "presets": [["@babel/preset-env", {
            useBuiltIns: 'usage'
        }]]
    }
}
```



**如果开发一个第三方库，类库。使用`babel-polyfill`会注入到全局，污染到全局环境**。

安装：`npm install --save-dev @babel/plugin-transform-runtime`

安装：`npm install --save @babel/runtime`

```javascript
{ 
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
      "plugins": ["@babel/plugin-transform-runtime"]
    }
}
```

当你要添加配置时

```javascript
{ 
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
      "plugins": [["@babel/plugin-transform-runtime", {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }]]
    }
}
```

如果你要将corejs赋值为2

安装：`npm install --save @babel/runtime-corejs2`

```javascript
{ 
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
      "plugins": [["@babel/plugin-transform-runtime", {
        "absoluteRuntime": false,
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }]]
    }
}
```

`@babel/plugin-transform-runtime`不会污染到全局环境。

当babel配置非常多的时候，可以将他们放到`.babelrc`文件里

在根目录下创建`.babelrc`文件

将`options`里的代码放到这个文件中，如下：

```javascript
{
  "plugins": [["@babel/plugin-transform-runtime", {
    "absoluteRuntime": false,
    "corejs": 2,
    "helpers": true,
    "regenerator": true,
    "useESModules": false
  }]]
}
```

#### react中应用babel

安装：`npm install --save-dev @babel/preset-react`

往刚刚的`.babelrc`文件中添加配置

```javascript
// presets对应一个数组，如果这个值需要做配置，那么这个值在包装进一个数组，放到第一项，第二项是个对象，用于描述该babel
{
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": "usage"
        }],
        "@babel/preset-react"
    ]
}
```

**注意：转换是先下后上，就是使用preset-react转换react代码，再用preset-env将js代码转换为es5代码**

