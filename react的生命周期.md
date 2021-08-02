# react的生命周期

> 其实react生命周期细分的化分为，V16.3之前 到 V16.3 然后到V16.4，主要原因是react-domV16.3之前的版本渲染是同步的，然后渲染的时候 会导致 CPU堵塞，所以为了解决这个问题，react提出了 [fiber](https://zhuanlan.zhihu.com/p/26027085) 解决方案，成为了异步处理渲染，这样导致渲染前的生命周期会重复调用，所以生命周期废弃了一部分API,出了新的API

## reactV16.0前的生命周期

### 1.组件初始化(initialization)阶段

>也就是以下代码中类的构造方法( constructor() ),Test类继承了react Component这个基类，也就继承这个react的基类，才能有render(),生命周期等方法可以使用，这也说明为什么`函数组件不能使用这些方法`的原因。

`super(props)`用来调用基类的构造方法( constructor() ), 也将父组件的props注入给子组件，功子组件读取(组件中props只读不可变，state可变)。
 而`constructor()`用来做一些组件的初始化工作，如定义this.state的初始内容。



```js
import React, { Component } from 'react';

class Test extends Component {
  constructor(props) {
      // super指向原类的构造方法
    super(props);
  }
}
```

### 2.组件的挂载(Mounting)阶段

> 此阶段分为componentWillMount，render，componentDidMount三个时期。(将要挂载，渲染，已经挂载)

- componentWillMount

  在组件挂载到DOM前调用，且只会被调用一次，在这边调用this.setState不会引起组件重新渲染，也可以把写在这边的内容提前到constructor()中，所以项目中很少用。

- render

  - 根据组件的props和state（两者的重传递和重赋值，无论值是否有变化，都可以引起组件重新render）

  - return 一个React元素（描述组件，即UI）不负责组件实际渲染工作，之后由React自身根据此元素去渲染出页面DOM
  - 不能在里面执行this.setState，会有改变组件状态的副作用，会重复调用render

- componentDidMount

  组件挂载到dom上后，只会调用一次