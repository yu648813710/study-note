# vue-cli3 的 打包优化

## 先看打包情况

- 需要安装 webpack-bundle-analyzer 

  - 正常打包 会出现一个分析页面，直接看即可

- 配置

```json
    chainWebpack: (config) => {
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
```
  - 需要在vue.config配置

## vue.config 里的 productionSourceMap 设置为false

- 由于vuecli 默认配置的webpack中是打开了 SourceMap 的，而服务端的更新通常都是增量更新，前端每次在打包的时候输出的SourceMap 文件会造成服务端文件冗余。并且在开启 SourceMap 之后build 速度会慢下来很多。

```json
module.exports = {
  productionSourceMap: false,
}
```

## 安装 compression-webpack-plugin 开启 Gzip 打包

Gzip是GNU zip的缩写，顾名思义是一种压缩技术。它将浏览器请求的文件先在服务器端进行压缩，然后传递给浏览器，浏览器解压之后再进行页面的解析工作。在服务端开启Gzip支持后，我们前端需要提供资源压缩包。

```js
// 在vue-config.js 中加入
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';

.....
module.exports = {
....
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  }
}
```



## CDN 引入，把一些不会变动的库换至 CDN 引入的方式（未完）

​         在index.html中，添加CDN资源，例如bootstrap上的资源： 

```html
<script src="https://cdn.bootcss.com/vue/2.5.2/vue.min.js"></script> 
<script src="https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js"></script>
<script src="https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js"></script>
```

