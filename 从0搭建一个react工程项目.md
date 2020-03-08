# 从0搭建一个react工程项目

### 从零搭建项目都需要搭建什么

> 按照之前使用最全的vue-cli脚手架来对比

- 热加载
- ECMAscript 6 的处理
- 模式
- 压缩打包
- 懒加载
- css的预处理
- eslint的语法检测

## 初始化项目

> 使用的包管理工具是 `yarn`

### yarn init

- 新建目录后 执行 yarn init，执行后 会让你写入项目信息，写入后会目录下会多一个 `packge.json`文件

  ```json
  {
    "name": "webpack-react",
    "version": "1.0.0",
    "description": "从零搭建",
    "main": "index.js",
    "author": "Yuwentao",
    "license": "MIT",
    "private": true
  }
  
  ```

### 安装`webapck`以及`webpack-cli`

- 运行 `yarn add webpack -D`
- 运行 `yarn add webpack-cli -D`

### 增加命令行任务

- 在 `package.json`文件中的 `script`选项写上 配置

  ```json
  "scripts": {
      "build": "webpack"
    }
  ```

  

### 配置入口以及出口文件

- 这块要用到 `webapck` 的知识 [entry]([https://www.webpackjs.com/concepts/#%E5%85%A5%E5%8F%A3-entry-](https://www.webpackjs.com/concepts/#入口-entry-)) 入口以及 [output]([https://www.webpackjs.com/concepts/#%E5%87%BA%E5%8F%A3-output-](https://www.webpackjs.com/concepts/#出口-output-)) 出口

上一步之所以能 build 成功 就是因为，webpack4的默认 entery 是 `src/index.js`而默认output出口是`dist/main.js`，要进行修改就必须新建 webpack.config.js ，在这个js文件里修改

```js
// node js 模块提供用于处理文件路径和目录路径的实用工具
const path = require('path')

module.exports = () => {
  return {
    // 入口
    entry: './src/one.js',
    // 出口配置
    output: {
      // 输出路径
      path: path.resolve(__dirname, "dist"),
      // 输出文件名称
      filename: 'index.js'
    }
  }
}
```

### 不同模式 mode 怎么配置

- 通过设置 mode 可以加载不同的 webpack 配置

模式分为 production  以及 development ,produciton 模式对打包进行了默认优化，可以直接 写在配置文件，也可直接执行命令 

```js
module.exports = () => {
  return {
    // 模式
    mode: 'development',
  }
}

webpack --mode=production
```

## 解决热加载问题

- 需要安装 webpack-dev-server 插件 进行配置 

  webpack.config.js文件的配置

  ```js
  "scripts": {
        "start": "webpack-dev-server --open"
      }
  ```

- 安装完成后，就可以进行热加载启动，可以设置端口号 ,设置启动的路径以及文件名称，以及是否显示打印台的log信息，以及进度显示 

  ```js
  // 热加载设置
  devServer: {
    // 端口号
    port: 1111,
    // 被作为索引的文件名称
    index: 'index.html',
    // 告诉 dev-server 在 server 启动后打开浏览器。默认禁用。
    open: true,
    // 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要
    contentBase: path.join(__dirname, 'public'),
  }
   // 不显示打印台的log以及进度显示 只能命令行配置 
    webpack-dev-server --info=false --progress
  ```

- 现在的热加载是有问题的，每次更新js都会导致页面重新加载，可以用 webpack 的热模块加载来实现，页面无加载

  ```js
  // 引入 webpack
  // 本身webpack 的模块
  const webpack = require('webpack');
  
  // 在 devServer 设置里加上
  // 热加载设置
  devServer: {
    // 模块热加载
    hot: true,
  },
   // 插件设置
   plugins: [
    // 热模块替换，如果只用热加载的话，每次文件有修改，页面都会重建加载
    new webpack.HotModuleReplacementPlugin()
  ],
  ```

- 在入口文件加上 热模块启动的执行

  当 devserver 启动时，出口文件不会打包在 硬盘中，而是存在 内存中，所以 设置的 启动 页面 应该引入 内存中的 打包后的文件 也就是 index.js

  ```html
  <!DOCTYPE html>
  <html lang="zh">
    <head>
      <script src="./index.js"></script>
    </head>
    <body>
    </body>
  </html>
  ```

  引入的入口 js 文件，写入热模块判断

  ```js
  if (module.hot) {

   module.hot.accept();

  }
  ```



## 解决es6的解析问题

- 先安装 babel 的包

  `yarn add @babel/core @babel/preset-env babel-loader -D`

- 配置`webpack.config.js`里的模块规则

  ```js
      // 这些选项决定了如何处理项目中的不同类型的模块
      module: {
        // 处理模块的规则
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            },
          }
        ]
      }
  ```

- 在根目录新建 `.babellrc`文件，写入配置

  ```js
  {
    "presets": ["@babel/preset-env"],
  }
  ```

## 设置不同模式的启动

> 按照 vue-cli 来搭建模式启动的，vue-cli可以通过 启动命令 设置不同 mode 来决定读取哪些 环境文件。

- 怎么通过 不同命令处理来标识 不同的 `env`

  命令行

  `"start:prd": "webpack-dev-server --info=false --progress --env=prd"`

  配置

  ```js
  module.exports = (env, argv) => {
    console.log(env) // prd
  }
  ```

  现在的命令可以启动不同的标识了 `env`，然后可以用不同的 `env`来标识不同的配置

- 怎么通过`env`来标识不同的配置

  

  拿到`env`后，就可以用它判断是什么命令启动，然后加载不同 webpack配置文件就行了

  

  先有基础的webpack配置文件 `webpack.config.js`，然后新建一个 `webpack.dev.config.js`文件，写入在 dev 模式运行需要加入什么配置

  

  ```js
  // dev 模式下的
  module.exports = (env, argv) => {
    return {
      // 模式
      mode: 'development',
      // 插件设置
      plugins: [
        // 允许创建一个在编译时可以配置的全局常量
        new webpack.DefinePlugin({
          'process.env': {
            'APP_IS': 'false'
          }
        })
      ],
    }
  }
  ```

  借助 ``

