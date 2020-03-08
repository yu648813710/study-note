// node js 模块提供用于处理文件路径和目录路径的实用工具
const path = require('path')

// 本身webpack 的模块
const webpack = require('webpack');

// 可以合并webpack配置的插件
const merge = require('webpack-merge');

// dev 下的配置
const devConfig = require('./webpack.dev.config');

// 启动命令的 模式
const envMode = process.env.ENV

let mergeConfig

if (envMode === 'prd') {
  mergeConfig = devConfig
}
let baseConfig = {
  // 模式
  mode: 'development',
  // 入口
  entry: [
    "@babel/polyfill",
    './src/index.js'
  ],
  // 出口配置
  output: {
    // 输出路径
    path: path.resolve(__dirname, "dist"),
    // 输出文件名称
    filename: 'index.js'
  },
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
    // 监听 设置的目录文件，变化后重载页面
    watchContentBase: true,
    // 热加载
    hot: true,
    // 去掉打印台的log
    clientLogLevel: 'none'
  },
  // 插件设置
  plugins: [
    // 热模块替换，如果只用热加载的话，每次文件有修改，页面都会重建加载
    new webpack.HotModuleReplacementPlugin(),
    // 允许创建一个在编译时可以配置的全局常量
    new webpack.DefinePlugin({
      'process.env': {
        'APP_IS': 'true'
      }
    })
  ],
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
}

console.log(merge(baseConfig, mergeConfig))

module.exports = merge(baseConfig, mergeConfig)