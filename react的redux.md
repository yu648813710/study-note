# react的状态管理



## 什么是状态管理

> 对于跨组件状态进行统一管理，更加方便组件间的通信以及逻辑公用，状态就是对于组件来说可变的变量。

## 为什么需要状态管理

- 随着应用的规模越来越大，功能越来越复杂，组件的抽象粒度会越来越细，在视图中组合起来后层级也会越来越深，能够方便的**跨组件共享状态**成为迫切的需求。
- 状态也需要按模块切分，状态的变更逻辑背后其实就是我们的业务逻辑，将其抽离出来能够彻底**解耦ui和业务**，有利于逻辑复用，以及持续的维护和迭代。
- 状态如果能够被集中的管理起来，并合理的派发有利于组件**按需更新**，缩小渲染范围，从而提高渲染性能

## 都有那些状态管理

### vue

- vuex

### react

- redux

其实主要是redux，剩下都是衍生出来的***类redux***的状态库，比如 `redux-sage,redux-thunk...`

## redux的使用流程

### 创建全局store属性

```js
// store.js 文件
import { createStore } from 'redux'
import reducer from './reducers' // 这个是修改store的文件
const store = createStore(reducer)
export default store;
```

### 在reducers里写入store的值以及改变函数

写入你要用的状态，以及改变状态的方法

```js
// todos.js
// 类似与vuex里的mutions
// reducers必需是一个方法，方法内含有两个参数，一个初始值，一个action的提交对象，action的规则是必须是含有type的一个对象
// 而且必须是一个纯函数，什么是纯函数，就是不改变参数的函数就是纯函数
const todos = (state = [], action) => {
    switch(action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        case 'CHANGE_TODO':
            return state.map(res => {
                if(res.id === action.id) {
                    res.completed = !res.completed;
                }
                return res;
            })
        default:
            return state
    }
}
export default todos
```

和其他的状态管理合并然后导出

```js
// index.js
import { combineReducers } from 'redux'
import todos from './todos' // todo任务列表的状态
import visibilityFilter from './visibilityFilter' // 筛选的状态
const todoApp = combineReducers({ // 这里的 combineReducers 类似与vuex里的module，是为了更好的管理大型状态
    todos,
    visibilityFilter
})

export default todoApp

```

### 在组件上使用

- 获取定义好的状态

  ```js
  import store from '../store' // 引入sore
  
  const todos = store.getState().todos; // 获取todos的状态
  ```

- 修改状态

  dispatch是唯一该正规改变state的方法，直接修改也可以但是并不规范，而且会导致调试工具无法处理

  ```js
  import store from '../store' // 引入sore
  
  const action = (id) => {
      return {
          type: 'CHANGE_TODO',
          id
      };
  };// 定义cation
  
  store.dispatch(action(1));// 使用dispatch执行reducer里的方法然后修改state
  
  ```

  

### store挂载到react的实例，然后state改变dom也可以响应

​	所有前面的代码其实只是组件的行为对于state产生改变，或者用 state，但是并无法完成响应渲染。

```js
import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import store from './store'

// 初次渲染
render(
    <App />,
  document.getElementById('root')
)
// 监听变化然后重新渲染, subscribe 监听属性
store.subscribe(()=> {
    render(
        <App />,
      document.getElementById('root')
    )
})
```

### 注意的点

- 全局应该只有一个store作为状态管理
- reducers应该是一个纯函数，不能修改参数，只能返回新的值
- ***type 没有校验重复名称，意思就是可以有相同的type会导致出现问题***

## redux的基础api

### createStore

- 参数
  1. `reducer` *(Function)*: 接收两个参数，分别是当前的 state 树和要处理的action，返回新的 state 树。
  2. [`preloadedState`] *(any)*: 初始时的 state。也就是说只能初始化的时候传值，如果需要后端数据那么请求后再初始化
  3. `enhancer` *(Function)*: Store enhancer 是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。这与 middleware 相似，它也允许你通过复合函数改变 store 接口。说白了就是可以在这个里面对action的过程做一个拦截，做一些动作，比如记载action的提交记录之类的。

### store

- getState()
- dispatch(action)
- subcribe(listener)
- replaceReducer(nextReducer)

着重说一下 `replaceReducer`,这个用法是可以替换当前的reducer，意思就是可以实现动态的reducer，比如可以给之前reducer增加新的reducer

### combineReducers

这个就是一个vuex里的module作用，可以组合多个reducer，传参也是reducer，示例如下

```js
rootReducer = combineReducers({potato: potatoReducer, tomato: tomatoReducer})
// rootReducer 将返回如下的 state 对象
{
  potato: {
    // ... potatoes, 和一些其他由 potatoReducer 管理的 state 对象 ... 
  },
  tomato: {
    // ... tomatoes, 和一些其他由 tomatoReducer 管理的 state 对象，比如说 sauce 属性 ...
  }
}
```

## react-redux

### 核心

- < Provider store>

  

- connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

## redux的调试工具

### 下载地址

- 有VPN的安装地址，[redux DevTools](https://chrome.google.com/webstore/search/redux?hl=zh-CN)
- 国内安装地址，[极简插件](https://chrome.zzzmh.cn/)

### 使用步骤

- 在入口文件写入 调用方法

  ``` js
  import React from 'react'
  import { render } from 'react-dom'
  import { createStore } from 'redux'
  import { Provider } from 'react-redux'
  import App from './components/App'
  import reducer from './reducers'
  
  // 判断是否有redux的开发者工具
  
  const reduxDevtools = window.devToolsExtension ? window.devToolsExtension() : ()=>{}
  
  // 使用即可
  const store = createStore(reducer, reduxDevtools)
  
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
  ```

- 查看浏览器控制台redux的选项里面有了一些内容

  ![image-20200815131109731](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20200815131109731.png)



## saga的出现

... 

## 参考文档

- [React-dedux](https://cn.redux.js.org/docs/react-redux/)
- [4 张动图解释为什么（什么时候）使用 Redux](https://segmentfault.com/a/1190000012142449)
- [redux调试工具](https://www.jianshu.com/p/c876eff736e7)



