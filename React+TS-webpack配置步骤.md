# React+TS webpack配置步骤

## 工程化项目需求

- JS框架是react
- ES6语法编译
- 支持热更新
- 支持环境变量
- 支持sass，less语法
- 支持图片资源加载
- ESLINT&CSSLINT
- 支持TS

## 初始化项目

### npm init

在终端运行 `npm init` ,会让你输入以下的东西

```shell
package name: (react-ts-demo)

```

### 建立文件目录

```text
+ public
 index.html

+ src
 *.js

- app.js

- webpack.config.js
```

### 安装必需依赖

#### webpack相关

#### bebal相关以及配置

```json
{
  "presets": [
      ["@babel/env"], // es6 预处理
      ["@babel/preset-react"] // jsx语法处理
  ],
  "plugins": ["react-hot-loader/babel"] // 热加载处理
}

```

### webpack.config.js初始配置

```js
// 创建webpack配置文件

const path = require('path');

// 导出配置
module.exports = {
    entry: './app.js', // 入口文件
    output: {
      filename: 'index.js', // 打包名称
      path: path.resolve(__dirname, 'dist'), // 打包路径
    },
    mode: 'development',
}
```

### React安装以及编写文件

### 管理输出

webapck文件如下

### 开发服务处理

#### build的watch状态

package.json文件如下

#### devServer配置 热启动

webpack文件如下

## 热加载

两者区别

Webpack HMR 和 React-Hot-Loader - 高山景行的文章 - 知乎 <https://zhuanlan.zhihu.com/p/30135527>

### webpack配置

- webpack.config.js 配置
- JS 写法

### react-hot配置

- 安装依赖
- 写入bebal.config.json的配置
- 改写入口文件

## 环境变量处理

### webpakc.config.js中获取

- 用法

  --env [NAME]=[变量]

  ```js
  "start:prd": "webpack serve --open --env NODEMODE=prd"
  ```

- 获取

  没使用插件情况下只能在webpack.config.js 获取，浏览器运行时无法获取

  ```js
  module.exports = env => {
   console.log(env.NODEMODE) // prd
  }
  ```

### 运行时获取

使用webpack自带插件 DefinePlugin

- webpack.config.js 配置

    ```js
    const webpack = require('webpack'); // 默认全局变量
    module.exports = env => {
    return {
        ...,
        plugins: [ // 插件管理
        // 环境变量处理
          new webpack.DefinePlugin({
            __DEV__: false,
          })
        ],
      }
    }
    ```

- 页面代码

  ```js
  import React, { useState } from 'react';
  import List from './list'
  
  const show = () => {
      console.log(__DEV__)
  }
  
  export default  () => {
  
  return (<div>
          <h1 onClick={show}>123</h1>
      </div>)
  }
  ```

- 处理为多个模式

    配置命令行

    ```shell
        "start": "webpack serve --open",
        "start:dev": "webpack serve --open model=dev",
        "start:prd": "webpack serve --open model=prd"
    ```

    后面的model 是不同类型，还需处理webpack.config.js 文件

  - 建立`env`文件夹，下面有文件夹 `index/prd/dev`
  - 利用·`model` 读取文件
  - 然后在`DefinePlugin` 插件使用
  - 需要注意的是 如果直接使用，会导致直接转为引用变量，所以需要用 `JSON.stringify(exportENV(env.model))`, [参考阅读](https://zhuanlan.zhihu.com/p/133443240)

    ```js
    const exportENV = (env) => {
      const currentENV = require(path.resolve(__dirname, 'env') + '/' + (env ? env : 'index') + '.js')
      return currentENV;
    }
    
    
    // 环境变量处理
    new webpack.DefinePlugin({
      GLOBAL_ENV: JSON.stringify(exportENV(env.model))
    })
    
    // 页面获取
    console.log(GLOBAL_ENV)
    
    ```

## css资源加载处理

> css资源加载包括，css-modules的命名处理方案解决 以及 预处理less 和 sass 的处理

### 安装依赖

style-loader 是为了处理css样式到Dom结构 需要在 文件里单独引入 css文件所以就需要 `import './index.csss'`，但是正常是不支持直接import css 文件的，所以需要 css-loader 来处理

```shell
yarn add style-loader css-loader -D
```

### webpack配置

```js
  module: {
      rules: [ // 配置加载器
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
```

### 进一步解决问题

#### 怎么处理命名冲突问题？

> css-loader的module配置项

- 配置如下

  ```js
    module: {
        rules: [ // 配置加载器
          {
            test: /\.css$/i,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: "[path][name]__[local]--[hash:base64:5]",// 解决 css冲突问题
                  },
                }
              }
              ],
          }
        ]
      },
  ```

- 需要注意的

  之前页面上写class 直接引入即可，但是现在不行 , 原因是module处理了css的命名规则，直接写 导致命名不对，所以只能动态引入如下对比

  ```js
  // 之前
  import './index.css'
  
  const index = () => {
   return <div className="app"></div>
  }
  
  // 启用modules之后
  
  import styles from './index.css'
  
  const index = () => {
   return <div className={stles.app}></div>
  }
  
  ```

#### 使用预处理less

- 安装依赖

  ```shell
  yarn add less less-loader -D
  ```

- webpack 配置

  ```js
    module: {
        rules: [ // 配置加载器
          {
            test: /\.css$/i,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: "[path][name]__[local]--[hash:base64:5]",// 解决 css冲突问题
                  },
                }
              }
              ],
          },
          'less-loader', // 预处理
        ]
      },
  ```

#### 打包后的style是由js加载到 没做到分离

- 安装依赖

  - mini-css-extract-plugin 抽离css
  
  ```shell
  yarn add mini-css-extract-plugin
  ```
  
  - webpack配置
  
    ```js
    
    // 抽取css成单独文件
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    
    module.exports = env => {
        return {
            ...,
            module: {
                rules: {
       ...,
                {
                  test: /\.(c|le)ss$/i,
                  use: [
                    'style-loader', // 解决css插入dom问题
                    MiniCssExtractPlugin.loader, // 抽取css文件
                    {
                      loader: 'css-loader',
                      options: {
                        modules: {
                          localIdentName: "[path][name]__[local]--[hash:base64:5]", // 解决 css冲突问题, 比较齐全的配置看文档 https://webpack.docschina.org/loaders/css-loader/#modules
                        },
                      }
                    }, // 解决 import 引入css问题
                    'less-loader', // 预处理
                  ],
                }
                }
            }
        }
    }
    ```
  
    配置完成后会发现，这个顺序是固定的，改变一个会导致报错，所以需要注意，然后还会发现 虽然css抽离出来了 但是 dom中并没有相关的class命名如下
  
    ![image-20210615225132799](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20210615225132799.png)

![image-20210615225154660](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20210615225154660.png)

​    但是资源中是有css文件的，接下来继续看文档找一下答案 ，答案地址 <https://webpack.docschina.org/plugins/mini-css-extract-plugin/#modules>

> *i 不要同时使用* `style-loader` *与* `mini-css-extract-plugin`*。*

​ 下面是解决方案

```js
// 命令行处理
 "build": "webpack --env css=dev", // 只给build加 因为开发模式用style-loader更快
     
// webpack  配置
     
module.exports = (env, args) => {

// dev 模式
const cssTypeDev = args.css === 'dev';

 return {
 ...,
     module: {
      rules: {
       ...,
            {
              test: /\.(c|le)ss$/i,
              use: [
                cssTypeDev ? 'style-loader' : {
                  loader: MiniCssExtractPlugin.loader,
                }, // 抽取css文件 'style-loader', // 解决css插入dom问题 这个判断是为了解决两个不能同时使用的问题
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      localIdentName: "[path][name]__[local]--[hash:base64:5]", // 解决 css冲突问题, 比较齐全的配置看文档 https://webpack.docschina.org/loaders/css-loader/#modules
                    },
                  }
                }, // 解决 import 引入css问题
                'less-loader', // 预处理
              ],
            }
         }
        plugins: [ // 插件管理
          ...,
          // 抽取css文件
          !cssTypeDev ? new MiniCssExtractPlugin() : []
        ],
     }
 }
 
}
```

#### 压缩css

安装插件

```shell
yarn add css-minimizer-webpack-plugin
```

webpack配置

```js
...

// 压缩css用的
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
...



// 导出配置
module.exports = (env, args) => {
 return {
        ...,
        optimization: {
          minimize: true, // 允许优化
          minimizer: [
            new CssMinimizerPlugin(), // 压缩css
          ]
        },
    }
}
```

## 图片资源处理

### 安装依赖

```shell
yarn add file-loader -D
```

### webpack

```js
// 导出配置
module.exports = (env, args) => {
 return {
        ...,
        module: {
          rules: [ // 配置加载器
                {
                  test: /\.(png|jpe?g|gif)$/i,
                  use: [
                    {
                      loader: 'file-loader'
                    }
                  ]
                }, // 文件处理
            },
          ]
    }
}
```

## 集成ESLINT

> 默认vscode已经安装eslint依赖，并且开启
>
> // 每次保存的时候将代码按eslint格式进行修复*
>
> "editor.codeActionsOnSave": {
>
> ​    "source.fixAll": true
>
> }

### 安装依赖

```shell
yarn add eslint babel-eslint eslint-plugin-import eslint-config-ali  -D
```

### 文件配置

- 新建文件 `.eslintrc`

  ```yaml
  {
      "extends": [
          "eslint-config-ali",
          "eslint-config-ali/react"
          // "eslint-config-ali/jsx-a11y" // 无障碍辅助功能
      ],
      "rules": {
          "semi": [2, "never"],
          "no-console": "off",
          "react/no-array-index-key": "off",
          "react/prop-types":"off"
      },
      "globals": { // 防止全局变量报错
          "GLOBAL_ENV": true
      },
      "ignorePatterns": [ // 忽略文件夹
          "dist",
          "node_modules",
          "*.d.ts"
      ]
  }
  ```

现在只是jslint 风格ok，如果需要react需要 安装阿里的 其他lint包 如下

### 安装依赖

```shell
yarn add eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y -D
```

### 文件配置

```yaml
{
    "extends": [
        "eslint-config-ali",
        "eslint-config-ali/react",
        "eslint-config-ali/jsx-a11y"
    ],
    "rules": {
        "semi": [2, "never"]
    }
}
```

## 集成TS

### 安装依赖

@babel/preset-typescript 是babel转义ts

@types/react 是react依赖的类型库

不需要ts-loader因为 babel的转译更快

```shell
yarn add typescript @babel/preset-typescript @types/react @types/react-dom @types/webpack-env -D 
```

### bebel.config.json修改

```json
{
  "presets": ["@babel/env", "@babel/preset-react", ["@babel/preset-typescript"]], // 新增
  "plugins": ["react-hot-loader/babel"]
}

```

### webpack修改

```js
module.exports = (env, args) => {
// prd 模式
  const cssTypePrd = args.env.css === 'prd'

  return {
    entry: './app.tsx', // 入口文件
    module: {
        rules: [ // 配置加载器
        {
          test: /\.(jsx|tsx|js|ts)?$/,// 处理es6语法以及jsx语法
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, 'src'), // 使用目录
            path.resolve(__dirname, 'app.tsx'), // 使用文件
          ],
        },
        ]
    },
    resolve: { // 新增因为现在的文件变为了 tsx 和ts后缀名所以需要增加两个后缀名 tsx和ts
      extensions: ['.tsx', '.ts', '.json', '.js'], // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    },
  }
}
```

全部react文件更名为TSX 原因是tsx语义更强

### ts-config.json 文件

> 虽然不需要ts-loader来进行转译，但是需要ts-config的配置和IDE协作

```json
{
    "compilerOptions": { // 编译配置
        "jsx": "react",
        "types": ["node", "react", "react-dom"],
        "allowSyntheticDefaultImports": true,
        // 不生成文件，只做类型检查
        "noEmit": true,        
    },
}
// 参考链接 https://segmentfault.com/a/1190000021421461 
// https://juejin.cn/post/6844904052094926855#heading-17
// 这里没用ts-loader所亿tsconfig的作用只有给IDE提示
```

### 外部的文件类型声明

> 在完成这些后会发现less 还有 img文件的import会标红，因为这些文件都需要类型声明 还有全局变量

新建一个 externals.d.ts

```ts
declare module '*.less' { // less报错

    const classes: { [className: string]: string };
  
    export default classes;
  
   }

// 文件报错声明
declare module '*.svg'

declare module '*.png'

declare module '*.jpg'

declare module '*.jpeg'

declare module '*.gif'

declare module '*.bmp'

declare module '*.tiff'

// 全局变量
declare var GLOBAL_ENV: string;

declare var module: any;

```
