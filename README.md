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



### 中级

#### tree shaking

一个模块里会导出很多东西。把一个模块里没有被用到的东西都给去掉。不会把他打包到入口文件里。tree shaking只支持es6的方式引入(`import`)，使用`require`无法使用`tree shaking`。



`webpack`的`development`无法使用`tree shaking`功能。除非在打包的配置里加上

```javascript
// 开发环境需要加如下代码
optimization: {
  usedExports: true
}
```

当你需要import某个模块，又不想`tree shaking`把他给干掉，就需要在package.json里修改`sideEffects`参数。比如当你`import  './console.js' `, `import './index.css'`等没有`export`(导出)模块的文件。又不想`tree shaking`把它干掉。

```javascript
// package.json
sideEffects: ['./console.js', './index.css']
// 反之
sideEffects: false
```

**在`development`环境即使你使用`tree shaking`，它也不会把其他多余的代码给干掉。他只会在打包的文件里注明某段代码是不被使用的。**

#### `development` 和 `production` 区别

`development`代码不压缩，`production`代码会压缩

省略…☺

`webpack-merge`

`react`和`vue`都会区分环境进行不同的`webpack`配置,但是它们一定会有相同的部分。这个时候需要通过使用`webpack-merge`进行抽离。

```javascript
// webpack.base.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    // mode: 'development',
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    optimization: {
        usedExports: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
}

// webpack.dev.config.js
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const devConfig = {
    mode: 'development',
}

module.exports = merge(baseConfig, devConfig)
```

这里就不重复把`production`环境在配置出来了，主要介绍下`webpack-merge`用法。

- 安装`npm i webpack-merge -D`

- 新建一个公共的文件如：`webpack.base.config.js`

- 将`development`和`production`两个`webpack`配置相同的抽离到`webpack.base.config.js`文件中

- 在环境配置文件中(具体代码如上)

  - `const merge = require('webpack-merge')`

  - `const baseConfig = require('./webpack.base.config.js')`

  - `module.exports = merge(baseConfig, devConfig)`

    

####  `code splitting`和`splitChunks`

当你把所有的代码都打包到一个文件的时候，每次改一个代码都需要重新打包。且用户都要重新加载下这个js文件。但是如果你把一些公共的代码或第三方库抽离并单独打包。通过缓存加载，会加快页面的加载速度。

1. 异步加载的代码，webpack会单独打包到一个js文件中
2. 同步加载的代码有两种方式



原始代码

```javascript
import _ from 'lodash'

console.log(666)
```



打包后的文件：

`main.js  551 KiB    main  [emitted]  main`
可以看到，webpack将业务代码跟lodash库打包到一个main.js文件了



方法一：

创建一个新文件

```javascript
import _ from 'lodash'
window._ = _
```

将文件挂载到`window`对象上,这样其他地方就可以直接使用了。

然后在webpack配置文件中的entry增加一个入口为该文件。让该文件单独打包。

```javascript
    Asset      Size  Chunks             Chunk Names
lodash.js   551 KiB  lodash  [emitted]  lodash
  main.js  3.79 KiB    main  [emitted]  main
```



方法二：

通过添加`optimization`配置参数

`optimization`: 会将诸如`lodash`等库抽离成单独的`chunk`,还会将多个模块公用的模块抽离成单独的`chunk`

```javascript
optimization: {
  splitChunks: {
    chunks: 'all'
  }
},
```

打包后文件：

```javascript
          Asset      Size        Chunks             Chunk Names
        main.js  6.78 KiB          main  [emitted]  main
vendors~main.js   547 KiB  vendors~main  [emitted]  vendors~main
```

可以看到，webpack将lodash抽成公共的chunk打包出来了。

`splitChunks`里面还可以在添加个参数`cacheGroups`



```javascript
optimization: {
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
          	// 下面的意思是：将从node_modules中引入的模块统一打包到一个vendors.js文件中
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                filename: 'vendors.js'
            },
            default: false
        }
    }
}
```

`cacheGroups`中`vendors`配置表示将从`node_modules`中引入的模块统一打包到一个vendors.js文件中



`splitChunks`的`vendors`的`default`参数：

根据上下文来解释，如上配置了`vendors`，打包`node_modules`文件夹中的模块，

那么`default`将会打包自己编写的公共方法。

当不使用`default`配置时。

```javascript
     Asset     Size             Chunks             Chunk Names
   main.js  315 KiB               main  [emitted]  main
   test.js  315 KiB               test  [emitted]  test
```

添加如下配置之后：

```javascript
optimization: {
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
          	// 下面的意思是：将从node_modules中引入的模块统一打包到一个vendors.js文件中
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                filename: 'vendors.js'
            },
            // 打包除上面vendors以外的公共模块
            default: {
                priority: -20,
                reuseExistingChunks: true, // 如果该chunk已经被打包进其他模块了，这里就复用了，不打包进common.js了
                filename: 'common.js'
            }
        }
    }
}
```

打包后的文件体积为

```javascript
     Asset      Size             Chunks             Chunk Names
 common.js   308 KiB  default~main~test  [emitted]  default~main~test
   main.js  7.03 KiB               main  [emitted]  main
   test.js  7.02 KiB               test  [emitted]  test
```





**配置说明**

```js
splitChunks: {
  chunk: 'all', // all(全部)， async(异步的模块)，initial(同步的模块)
  minSize: 3000, // 表示文件大于3000k的时候才对他进行打包
  maxSize: 0,
  minChunks: 1, // 当某个模块满足minChunks引用次数时，才会被打包
  maxAsyncRequests: 5, // 在打包某个模块的时候，最多分成5个chunk，多余的会合到最后一个chunk中。这里分析下这个属性过大过小带来的问题。当设置的过大时，模块被拆的太细，造成并发请求太多。影响性能。当设置过小时，比如1，公共模块无法被抽离成公共的chunk。每个打包出来的模块都会有公共chunk
  automaticNameDelimiter: '~', // 当vendors或者default中的filename不填时，打包出来的文件名就会带~
  name: true,
  cashGroups: {} // 如上
}
```

 [maxAsyncRequests](<https://www.jianshu.com/p/91e1082bce20>)