# CSS-Modules学习笔记

## 局部作用域

> CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。

- 产生局部作用域的唯一方法，就是使用一个独一无二的`class`的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。
  - 构建工具会把标签上的class以及样式表里的都进行哈希编译，这样就只对组件有效了

```jsx
/* 示例写法 */
/* 样式表正常写，组件需要按照变量的方式写class如下 */
import React from 'react';
import styles from './App.css';

export default () => {
  return (
    <h1 className={styles.title}>
      Hello World
    </h1>
  );
};

```



## 全局作用域

> CSS Modules 允许使用`:global(.className)`的语法，声明一个全局规则。凡是这样声明的`class`，都不会被编译成哈希字符串。

```css
/* css示例 */
:global(.title) {
  color: green;
}
```



```jsx
/* 示例写法 */
/* 组件正常写 */
import React from 'react';
import styles from './App.css';

export default () => {
  return (
    <h1 className="title">
      Hello World
    </h1>
  );
};

```



> CSS Modules 还提供一种显式的局部作用域语法`:local(.className)`，等同于`.className`，所以上面的`App.css`也可以写成下面这样

```css
/* 和正常写并没什么不同 */
:local(.title) {
  color: red;
}

:global(.title) {
  color: green;
}
/* 定义多个全局 */
:global {
  .link {
    color: green;
  }
  .box {
    color: yellow;
  }
}
```

## 定制哈希类名

> `css-loader`默认的哈希算法是`[hash:base64]`，这会将`.title`编译成`._3zyde4l1yATCOkgn-DBWEL`这样的字符串。webpack.config.js可以定制哈希字符串格式

```js
module: {
  loaders: [
    // ...
    {
      test: /\.css$/,
      loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]" // 表示取路径以及文件名称以及本来class的名称以及哈希的前五位，中间连接符可以随便起
    },
  ]
}
```

## class的组合

> 在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这称为"组合"（["composition"](https://github.com/css-modules/css-modules#composition)）。

```css
/* 示例 */
.className {
  background-color: blue;
}

.title {
  composes: className;
  composes: className;	/* 可以写多个组合 */
  color: red;
}
```

如果class与继承的class样式有重复的 会直接选用继承class的样式，因为组件编译下来直接是两个class 所以选后一个class的样式

```html
<h1 data-reactroot="" class="_2DHwuiHWMnKTOYG45T0x34 _10B-buq6_BEOTOl9urIjf8">Hello World</h1>
类名分别是 "_2DHwuiHWMnKTOYG45T0x34" "_10B-buq6_BEOTOl9urIjf8"
```

## 输入其他模块

> 选择器也可以继承其他css文件里的规则

```css
/* a.css */
.className {
    font-size:12px;
}
/* b.css */
.title {
    composes: className from './a.css',
    color:red;
}
```

## 输入变量

> CSS Modules 支持使用变量，不过需要安装 PostCSS 和 [postcss-modules-values](https://github.com/css-modules/postcss-modules-values)。

```bash
$ npm install --save postcss-loader postcss-modules-values
```

把`postcss-loader`加入[`webpack.config.js`](https://github.com/ruanyf/css-modules-demos/blob/master/demo06/webpack.config.js)。

```js
{
	test: /\.css$/,
	loader: "style-loader!css-loader?modules!postcss-loader"
},
```

## react-creact-app使用css-module的方法

- 第一种

  - 新建css文件使加入 [name].module.css的命名规则，引入方式也有区别

    ```js
    import styles from './Button.module.css'; // 使用 CSS Modules 的方式引入
    import './another-stylesheet.css'; // 普通引入
    ```

    

- 第二种

  - 打开react-creact-app的隐藏配置

    ```bash
    yarn eject
    ```

  - 在use属性执行的方法中添加 `modules:true`

    ```js
    {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            module: true, // css-module模式开启
            sourceMap: isEnvProduction && shouldUseSourceMap,
          }),
    },
    ```

    然后文件名称后面就不用加module了 直接 就可以按照cssmodule的方式使用就好

