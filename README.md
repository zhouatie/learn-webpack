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
  minChunks: 1, // 当某个模块满足minChunks引用次数时，才会被打包。例如,lodash只被一个文件import，那么lodash就不会被code splitting,lodash将会被打包进 被引入的那个文件中。如果满足minChunks引用次数，lodash会被单独抽离出来，打出一个chunk。
  maxAsyncRequests: 5, // 在打包某个模块的时候，最多分成5个chunk，多余的会合到最后一个chunk中。这里分析下这个属性过大过小带来的问题。当设置的过大时，模块被拆的太细，造成并发请求太多。影响性能。当设置过小时，比如1，公共模块无法被抽离成公共的chunk。每个打包出来的模块都会有公共chunk
  automaticNameDelimiter: '~', // 当vendors或者default中的filename不填时，打包出来的文件名就会带~
  name: true,
  cashGroups: {} // 如上
}
```

 [maxAsyncRequests](<https://www.jianshu.com/p/91e1082bce20>)

#### Lazy Loading

异步`import`的包会被单独打成一个`chunk`

```javascript
async function getComponent() {
    const { default: _ } = await import(/* webpackChunkNanem:'lodash */ 'lodash')
    const element = document.createElement('div')
    element.innerHTML = _.join(['Dell', 'Lee'], '-')
    return element
}
document.addEventListener('click', () => {
    getComponent().then(element => {
        document.body.appendChild(element)
    })
})
```



[lazy loading](<https://webpack.js.org/guides/lazy-loading>)



#### chunk

每一个`js`文件都是一个`chunk`

`chunk`是使用`Webpack`过程中最重要的几个概念之一。在Webpack打包机制中，编译的文件包括entry（入口，可以是一个或者多个资源合并而成，由html通过script标签引入）和chunk（被entry所依赖的额外的代码块，同样可以包含一个或者多个文件）。从页面加速的角度来讲，我们应该尽可能将所有的js打包到一个bundle.js之中，但是总会有一些功能是使用过程中才会用到的。出于性能优化的需要，对于这部分资源我们可以做成按需加载。



#### 打包分析

打包分析：

安装：`npm install --save-dev webpack-bundle-analyzer`

```javascript
// package.json => scripts

"analyz": "NODE_ENV=production npm_config_report=true npm run build"
```



```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin()
]
```



执行命令`npm run analyz`

浏览器就会自动打开`localhost:8888`，分析图就会展现在你眼前

非常清晰直观的看出

![image-20190421142354243](/Users/zhouatie/Library/Application Support/typora-user-images/image-20190421142354243.png)





#### CSS文件的代码分割

我们之前写的css文件都会被打包进js文件中，要想把css单独打包成一个css文件该怎么做呢？

这个时候就需要用到`MiniCssExtractPlugin`

开发环境用不到这个功能，一般都是用在生产环境中。

安装：`npm install --save-dev mini-css-extract-plugin`



```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module: {
  rules: [
    {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          // 可以在此处指定publicPath
          // 默认情况下，它在webpackoptions.output中使用publicPath
          publicPath: '../',
          // hmr: process.env.NODE_ENV === 'development',
        },
      }, 'css-loader']
    }
  ]
},
plugins: [
  new MiniCssExtractPlugin({
    // 与webpackoptions.output中相同选项类似的选项
    // 两个选项都是可选的
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
]

// index.js
import './index.css';
console.log('haha')

// index.css
body {
    background: green;
}
```

这样打包之后，css会被单独打包成一个css文件。



#### 缓存

目前为止，我们每次修改内容，打包出去后的文件名都不变。线上环境的文件是有缓存的。所以当你文件名不变的话，更新内容打包上线。有缓存的电脑就无法获取到最新的代码。

这个时候我们就会用到`contenthash`

我们先记录配置`contenthash`之前打包的文件名。

```javascript
     Asset       Size  Chunks             Chunk Names
index.html  180 bytes          [emitted]  
   main.js   3.81 KiB    main  [emitted]  main
```

接下来我们来配置下`contenthash` (就是根据你文件内容生成的hash值)

```javascript
// webpack.config.js
output: {
  path: path.resolve(__dirname, '../dist'),
  filename: '[name][contenthash].js'
},
```

打包完之后会在`main`后面接上`hash`值。

```javascript
                      Asset       Size  Chunks             Chunk Names
                 index.html  200 bytes          [emitted]  
mainf5faa2d3d1e119256290.js   3.81 KiB    main  [emitted]  main
```

当你不更新内容重新打包后，`contenthash`还会维持不变。所以线上用户访问的时候就不会去服务器重新拿取代码，而是从缓存中取文件。



#### `shimming` (预置依赖)

以`jquery`为例，代码如下

```javascript
// index.js
import $ from 'jquery'
$('body').html('HHAHAH')
import func from './test.js'
func()


// test.js
export default function func() {
    $('body').append('<h1>2</h1>')
}

```

当你不在test.js中引入`import $ from 'jquery'`

那么浏览器访问的时候，会报

`test.js:5 Uncaught ReferenceError: $ is not defined`



这个时候就需要使用垫片功能

```javascript
const webpack = require('webpack')

plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery'
  })
]
```

当你加上这段代码后，模块在打包的时候，发现你使用了`$`就会在你模块顶部自动加入`import $ from 'jquery'`

**其他关于`shimming`的内容参考`webpack`官网  [shimming](<https://webpack.js.org/guides/shimming>)**



### 高级



#### library

当你要开发第三方库供别人使用时，就需要用到`library`和`libraryTarget`这两个配置了。

**`library`**

```javascript
output: {
    filename: 'library.js',
    library: 'library',
    libraryTarget: 'umd'
},
```

`library`: 当配置了这个`library`参数后，会把`library`这个`key`对应的`value`即上面代码`library`挂载到全局作用域中。`html`用`script`标签引入，可以通过访问全局变量`library`访问到我们自己开发的库。

`libraryTarget`:这个默认值为`var`。意思就是让library定义的变量挂载到全局作用域下。当然还有浏览器环境的`window`,`node`环境的`global`,`umd`等。当设置了`window`、`global`,`library`就会挂载到这两个对象上。当配置了`umd`后，你就可以通过`import`,`require`等方式引入了。



**`externals`**

`exterals`是开发公共库很重要的一个配置。当你的公共库引入了第三方库的时候，公共库会把该第三方库也打包进你的模块里。当使用者也引入了这个第三方库后，这个时候打包就会又打了一份第三方库进来。

所在在公共模块库中配置如下代码

```javascript
externals: {
    // 前面的lodash是我的库里引入的包名 比如 import _ from 'lodash'
    // 后面的lodash是别人业务代码需要注入到他自己模块的lodash 比如 import lodash from 'lodash',注意不能import _ from 'lodash',因为配置项写了lodash 就不能import _
    lodash: 'lodash'
},
```

**前面的`lodash`是我的库里引入的包名 比如` import _ from 'lodash'`,后面的`lodash`是别人业务代码需要注入到他自己模块的`lodash` 比如 `import lodash from 'lodash'`,注意不能`import _ from 'lodash'`,因为配置项写了`lodash` 就不能`import _`。**

本人做了个试验，当自己开发的包不引入`lodash`,业务代码中也不引入`lodash`,那么打包业务代码的时候，`webpack`会把`lodash`打进你业务代码包里。

当然`externals`,配置还有多种写法，如下

```javascript
externals: {
    lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
    }
}

externals: ['lodash', 'jquery']

externals: 'lodash'
```

具体请参考官网[externals](<https://webpack.js.org/configuration/externals#externals>)



#### 发布自己开发的npm包

学了上面的配置后，就需要学习下如何将自己的包发布到`npm`仓库上了。

- `package.json` 的入口要改成`dist`目录下的js文件如： `"main": "./dist/library.js"`

- 注册npm账号。npm会发送一份邮件到你的邮箱上，点击下里面的链接进行激活。
- 命令行输入`npm login` 进行登录，或者`npm adduser` 添加账号
- `npm publish`

当出现如下提示代表发布成功

```javascript
// 当出现类似如下代码时，表示你已经发布成功
➜  library git:(master) ✗ npm publish
+ atie-first-module-library@1.0.0
```



遇到的问题：

当你遇到`npm ERR! you must verify your email before publishing a new package`说明你还没有激活你的邮箱，去邮箱里点击下链接激活下就ok了

当你已经登录了提醒`npm ERR! 404 unauthorized Login first`,这个时候你就要注意下你的`npm`源了，看看是否设置了淘宝源等。记得设置回来`npm config set registry https://registry.npmjs.org/`



#### PWA



http-server

workbox-webpack-plugin

相信很多朋友都有耳闻过`PWA`这门技术,`PWA`是`Progressive Web App`的英文缩写， 翻译过来就是渐进式增强WEB应用， 是Google 在2016年提出的概念，2017年落地的web技术。目的就是在移动端利用提供的标准化框架，在网页应用中实现和原生应用相近的用户体验的渐进式网页应用。

优点：

1. **可靠** 即使在不稳定的网络环境下，也能瞬间加载并展现
2. **快** 快速响应，并且 动画平滑流畅



应用场景：

当你访问正常运行的服务器页面的时候，页面正常加载。可当你服务器挂了的时候，页面就无法正常加载了。

这个时候就需要使用到pwa技术了。

这里我编写最简单的代码重现下场景：

```javascript
// webpack.config.js
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
        new HtmlWebpackPlugin()
    ]
}

// index.js
console.log('this is outer console')

// package.json
{
  "name": "PWA",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "start": "http-server ./dist"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.1",
    "html-webpack-plugin": "^3.2.0",
    "http-server": "^0.11.1",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.1",
  }
}

```

执行下`npm run build`

```javascript
.
├── bundle.js
└── index.html
```

为了模拟服务器环境，我们安装下`http-server`

`npm i http-server -D`

配置下`package.json`，`"start": "http-server ./dist"`

执行`npm run start`来启动dist文件夹下的页面



这个时候控制台会正常打印出`'this is outer console'`

当我们断开`http-server`服务后，在访问该页面时，页面就报404了



这个时候就需要使用到pwa技术了



使用步骤：

安装： `npm i workbox-webpack-plugin -D`

webpack配置文件配置：

```javascript
// webpack.config.js
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
```



这里我们写一个最简单的业务代码，在注册完pwa之后打印下内容：

```javascript
// index.js
console.log('this is outer console')

 // 进行 service-wroker 注册
 if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(registration => {
                console.log('====== this is inner console ======')
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
```



执行下打包命令：`npm run build`

```javascript
.
├── bundle.js
├── index.html
├── precache-manifest.e21ef01e9492a8310f54438fcd8b1aad.js
└── service-worker.js
```

打包之后会生成个`service-worker.js`与`precache-manifest.e21ef01e9492a8310f54438fcd8b1aad.js`

接下来再重启下`http-server`服务：`npm run start`



页面将会打印出

```javascript
this is outer console
====== this is inner console ======
...
```

然后我们再断开`http-server`服务



刷新下页面，竟然打印出了相同的代码。说明pwa离线缓存成功。



#### typescript

使用webpack打包ts文件，就需要安装`ts-loader`

安装：`npm i ts-loader typescript -D`

`webpack.config.js`文件中添加解析`typescript`代码的`loader`

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin()
    ]
}
```

配置了`webpack.config.js`还不行，还得在根目录文件下新增个`.tsconfig.json`文件

```javascript
{
    "compilerOptions": {
        "outDir": "./dist/", // 默认解析后的文件输出位置
        "noImplicitAny": true, // 存在隐式 any 时抛错
        "module": "es6", // 表示这是一个es6模块机制
        "target": "es5", // 表示要讲ts代码转成es5代码
        "allowJs": true // 表示允许引入js文件。TS 文件指拓展名为 .ts、.tsx 或 .d.ts 的文件。如果开启了 allowJs 选项，那 .js 和 .jsx 文件也属于 TS 文件
    }
}
```

新建`index.ts`

```javascript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");

let button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
    alert(greeter.greet());
}

document.body.appendChild(button);
```

执行打包命令，访问打包后的页面，页面正常执行。



当需要使用`lodash`等库时，

需安装：`npm i @types/lodash -D`

修改页面代码 引入 `lodash`

```javascript
import * as _ from 'lodash'

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");

let button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
    alert(_.join(['lodash', greeter.greet()], '-'));
}

document.body.appendChild(button);
```



**提醒：ts使用的包，可通过`https://microsoft.github.io/TypeSearch` 这个网址去查对应的包使用指南**



#### 使用`WebpackDevServer`实现请求转发

当我们工作本地开发某一个需求的时候，需要将这块需求的请求地址转发到某个后端同事的本地服务器或某个服务器上，就需要用到代理。然后其他页面的请求都走测试环境的请求。那么我们该怎样拦截某个请求，并将其转发到我们想要转发的接口上呢？



这个时候就需要用到`webpack-dev-server`

主要看`devServer`配置：

```javascript
// webpack.config.js
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: './index.js',
    output: {
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin()
    ]
}
```

```javascript
// package.json

scripts: {
  "server": "webpack-dev-server"
}
```

```javascript
// index.js
import axios from 'axios'

const div = document.createElement('div')
div.innerHTML = 'hahahha'
div.addEventListener('click', () => {
    alert('hahah')
    axios.get('/list').then(res => {
        console.log(res)
    })
})

document.body.appendChild(div)
```

在写一个本地启动的服务端代码

```javascript
const express = require('express')
const app = express()

app.get('/api/list', (req, res) => {
    res.json({
        success: true
    })
})

app.listen(8888, () => {
    console.log('listening localhost:8888')
})
```



执行`npm run server`命令，浏览器会自动打开页面。点击div后，会发起请求。

浏览器提示`http://localhost:8080/api/list 404 (Not Found)`,表示该接口不存在。

因为我们`webpack`启动静态资源服务器默认端口为8080，所以他求会直接请求到8080的/api/list接口。所以会提示找不到该接口。



为了解决这个问题，我们就需要将该请求从8080端口代理到8888端口(也就是我们自己本地启动的服务)



配置`webpack.config.js`

这里我只展示`devServer`代码

```javascript
// webpack.config.js
devServer: {
    contentBase: './dist',
    open: true,
    hot: true,
    proxy: {
        '/api': {
            target: 'http://localhost:8888'
        }
    }
},
```

配置`devServer`的`proxy`字段的参数，将请求`/api`开头的请求都转发到`http://localhost:8888`,

通过这个方法可以解决一开始提到的本地开发的时候，只想把部分接口转发到某台部署新需求的服务器上。比如当你这个项目请求很多，不同接口部署在不同的端口或者不同的服务器上。那么就可以通过配置**第一个路径**，来区分不同的模块。并转发到不同的服务上。如：

```javascript
// webpack.config.js
devServer: {
    contentBase: './dist',
    open: true,
    hot: true,
    proxy: {
        '/module1': {
            target: 'http://localhost:8887'
        },
        '/module2': {
            target: 'http://localhost:8888'
        },
        '/module3': {
            target: 'http://localhost:8889'
        }
    }
},
```

当你要代理到某个https的接口上，就需要设置`secure: false`

```javascript
// webpack.config.js
devServer: {
    proxy: {
        '/api': {
            target: 'https://other-server.example.com',
            secure: false
        }
    }
}
```



```javascript
target: ''， // 代理的目标地址
secure: false, // 请求https的需要设置
changeOrigin: true,  // 跨域的时候需要设置
headers: {
  host: 'http://www.baidu.com', //修改请求域名
  cookie: ''
}
...
```

其他关于`devServer`的配置详见[devServer](<https://webpack.js.org/configuration/dev-server#devserverproxy>)



#### WebpackDevServer解决单页面路由404问题

相信大家都是开发过vue或者react单页面带路由的应用。这里就忽略业务代码，介绍下`devServer`的`historyApiFallback`参数

```javascript
devServer: {
  historyApiFallback: true, // 当设置为true时，切换路由就不会出现路由404的问题了
}
```

详见[historyApiFallback](<https://webpack.js.org/configuration/dev-server#devserverhistoryapifallback>)





#### eslint

安装`eslint`: `npm i eslint -D`

目录下新建`.eslintrc.json`文件。



`environment`: 指定脚本的运行环境

`globals`: 脚本在执行期间访问的额外全局变量。

`rules`: 启动的规则及其各自的错误级别。

`解析器选项`: 解析器选项



编辑你的`eslint`的规则

```javascript
{
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": 2
    }
}
```



`vscode`安装`eslint`插件。



配置下`webpack.config.js`配置。

```javascript
...
devServer: {
    overlay: true,
    contentBase: './dist',
    hot: true,
    open: true
},
module: {
    rules: [{
        test: /\.js$/,
      	exclude: /node_modules/,
        use: ['eslint-loader']
    }]
}
...
```

`eslint-loader`是用于检查`js`代码是否符合`eslint`规则。

这里`devServer`中的`overlay`的作用是，当你eslint报错的时候，页面会有个报错蒙层。这样就不局限于编辑器（vscode)的报错提醒了。

如果js代码使用了多个loader，那么eslint-loader一定要写在最右边。如果不写在最后一个的话，需在里面添加`enforce: "pre"`,这样不管写在哪个位置都会优先使用`eslint-loader`校验下代码规范。

```javascript
{
    loader: 'eslint-loader',
    options: {
        enforce: "pre",
    }
}
```



#### 提升`webpack`打包速度的方法



##### 1. 跟上技术的迭代

 - 升级`webpack`版本 `node`版本` npm`等版本

##### 2. 尽可能少的模块上应用`loader`

 - `include` `exclude`

##### 3. 尽可能少的使用`plugin`

##### 4. `resolve`

```javascript
resolve: {
    extensions: ['.js'],
    alias: {
        'src': path.resolve(__dirname, '../src')
    }
}
```

`extensions`: 可以让你import模块的时候不写格式，当你不写格式的时候，webpack会默认通过extensions中的格式去相应的文件夹中找



`alias`:当你`import`的路径很长的时候，最好使用别名，能简化你的路径。

比如：`import index.js from '../src/a/b/c/index.js'`

设置别名：

```javascript
resolve: {
    alias: {
        '@c': path.resolve(__dirname, '../src/a/b/c')
    }
}
```

这样你的`import`导入代码就可以改成`import index.js from '@c/index.js'`



##### 5. dllPlugin



我们先记录下不使用`dll`打包时间`787ms`：

```javascript
Time: 787ms
Built at: 2019-05-04 18:32:29
     Asset       Size  Chunks             Chunk Names
 bundle.js    861 KiB    main  [emitted]  main
index.html  396 bytes          [emitted] 
```

接下来我们就尝试使用`dll`技术

我们先配置一个用于打包`dll`文件的`webpack`配置文件，生成打包后的`js`文件与描述动态链接库的`manifest.json`

```javascript
// webpack.dll.config.js
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
```



**重点：这里引入的DllPlugin插件，该插件将生成一个manifest.json文件，该文件供webpack.config.js中加入的DllReferencePlugin使用，使我们所编写的源文件能正确地访问到我们所需要的静态资源（运行时依赖包）。**



配置下`package.json`文件的`scripts`: `"build:dll": "webpack --config webpack.dll.config.js"`

执行下 `npm run build:dll`

```javascript
Time: 548ms
Built at: 2019-05-04 18:54:09
        Asset     Size  Chunks             Chunk Names
vendor.dll.js  157 KiB       0  [emitted]  vendor
```



除了打包出`dll`文件之外，还得再主`webpack`配置文件中引入。这里就需要使用到`DllReferencePlugin`。具体配置如下：

```javascript
// webpack.config.js
new webpack.DllReferencePlugin({
  manifest: require('./dll/vendor.manifest.json')
}),
```

这里的`manifest`：需要配置的是你`dllPlugin`打包出来的`manifest.json`文件。让主`webpack`配置文件通过这个

描述动态链接库`manifest.json`文件，让`js`导入该模块的时候，直接引用`dll`文件夹中打包好的模块。



看似都配置好了，接下来执行下命令 `npm run build`



使用`dll`打包后时间：

```javascript
Time: 471ms
Built at: 2019-05-04 18:19:49
     Asset       Size  Chunks             Chunk Names
 bundle.js   6.43 KiB    main  [emitted]  main
index.html  182 bytes          [emitted]  
```



**直接从最开始的`787ms`降低到`471ms`，当你抽离的第三方模块越多，这个效果就越明显。**



浏览器跑下`html`页面，会报错

`Uncaught ReferenceError: vendor_e406fbc5b0a0acb4f4e9 is not defined`



这是因为`index.html`还需要通过`script`标签引入这个`dll`打包出来的`js`文件

我们如果每次自己手动引入的话会比较麻烦，如果`dll`文件非常多的话，就难以想象了。



这个时候就需要借助`add-asset-html-webpack-plugin`这个包了。

```javascript
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

new AddAssetHtmlPlugin({
  filepath: path.resolve(__dirname, './dll/vendor.dll.js')
})
```

通过这包，`webpack`会将`dll`打包出来的`js`文件通过`script`标签引入到`index.html`文件中

这个时候你在`npm run build`，访问下页面就正常了





##### 6. 控制包文件大小

tree-shaking 等



##### 7. thread-loader parallel-webpack happypack等多进程打包



##### 8. 合理使用sourceMap



##### 9. 结合stats分析打包结果

借助线上或者本地打包分析工具



##### 10. 开发环境内存编译

开发环境的时候不会生成dist文件夹，会直接从内存中读取，因为内存读取比硬盘读取快



##### 11. 开发环境无用插件剔除



### 深入



#### 编写loader



```javascript
// index.js
console.log('hello, atie')
```



配置`webpack.config.js`

```javascript
// webpack.config.js

module: {
  rules: [
    {
      test: /\.js$/,
      include: /src/,
      loader: path.resolve(__dirname, './loaders/replaceLoader.js')
    }
  ]
},
```



```javascript
// 函数不能使用箭头函数
module.exports = function(source) {
    console.log(source, 'source')
    return source.replace('atie', 'world')
}
```

`loader`文件其实就是导出一个函数，`source`就是`webpack`打包出的`js`字符串。这里的`loader`就是将上面的`console.log('hello, atie')`替换为`console.log('hello, world')`

打包下代码，不出所料。控制台就会打印出`hello, world`



当你想要给loader传参时，可配置如下

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      include: /src/,
      use: [{
        loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
        options: {
          name: 'haha'
        }
      }]
    }
  ]
},
```

通过给`loader`添加`options`

这样`loader`中就可以通过`this.query`获取该参数了

```javascript
module.exports = function(source) {
  	// 控制台输出：console.log('hello atie') { name: 'haha' } source
    console.log(source, this.query, 'source')
    return source.replace('atie', 'world')
}
```

当然变量不一定非要通过`this.query`来获取

可通过`loader-utils`这个包来获取传入的变量

安装: `npm i loader-utils -D`

```javascript
const loaderUtils = require('loader-utils')

// 函数不能使用箭头函数
module.exports = function(source) {
    // console.log(source, this.query, 'source')
    const options = loaderUtils.getOptions(this)
    console.log(options, 'options') // { name: 'haha' } 'options'
    return source.replace('atie', 'world')
}
```

打印出来的与上面`this.query`一致

上面都是直接通过`return`返回的，那么我们还有没有其他方法返回`loader`翻译后的代码呢？`

这里就会用到`callback`

```javascript
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

上面的代码就可以改写成

```javascript
module.exports = function(source) {
    const options = loaderUtils.getOptions(this)
    const result = source.replace('atie', options.name)
    this.callback(null, result)
}
```

`callback`优势在于它可以传递多余的参数



```javascript
module.exports = function(source) {
    setTimeout(() => {
        return source.replace('atie', 'world')
    }, 1000)
}
```

当我们把`return`包到异步方法里，打包的时候就会报错，那么我们该怎么办呢？

这个时候就需要用到`this.async()`

```javascript
module.exports = function(source) {
    const callback = this.async()
    setTimeout(() => {
        callback(null, source.replace('atie', 'world'))
    }, 2000)
}
```

通过调用`this.async()`返回的`callback`方法来返回结果



**use中的loader执行顺序，先右后左，先下后上**





