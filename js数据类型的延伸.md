# js数据类型的延伸

这两天在复习基础知识，把之前的 觉得还存在模糊不清的知识想弄的再清楚一点，就针对数据类型的相关知识总结了一下

## 数据类型分类

> js的数据类型分为 值类型 和 引用类型 ，区分的依据就是本身不可变，只能重新赋值

### 值类型

- string
- number
- boolean
- null
- undefined
- Symbol 
- BigInt

### 引用类型

- Object
  - Array
  - Function
  - RegExp
  - Date
  - ...



## 类型的识别

> 如果有类型，那么就必须提到类型的识别，识别方法主要有以下几种

### typeof

- 使用方法

  ```js
  typeof <值> // 值类型除了null以外都可以正常检测
  ```

- 缺点

  这个方法是有缺点的，无法检测引用类型的值，比如array和object检测出来都是 object，包括原始值null也是object

- 问题

  - 为什么 typeof 检测null也是 object，引用类型也是object

    js是32位BIT 来存储值的，而且使用值的第 1 位 - 3 位来识别类型，而 null 与 object 的低三位都是 0 ，所以导致检测出现问题。

  - 为什么官方不改进？

    害怕出现旧项目不兼容问题，所以迟迟没有改动

### instanceOf

- 使用方法

  ```js
  const a = []
  a instanceof Array // true 
  ```

- 缺点

  - 只可检测 引用类型，但是null不可用
  - 检测 arr 类型时 直接 写Object 也是 true

- 问题

  - 为什么无法检测null 而且 检测不精准

    instanceof 运算符本身是用来检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上，意思就是 必需是 new 出来的 实例，且值的自身有 构造函数才可以检测，但是值类型 是没有构造函数的 所以无法检测，而 array 的构造函数的原型 本身继承于 Object 所以导致检测不精准，如下

    ```js
    const a = 1;
    a instanceof Number; // false
    const b = new Number(1);
    b instanceof Number; // true
    b instanceof Object; // true
    Number instanceof Object; // true
    Array instanceof Object; // true
    ```

### Object.prototype.toString.call()

- 使用方法

  ```js
  Object.prototype.toString.call(1) // [Object Number]
  Object.prototype.toString.call(<值>) // [Object 值类型]
  ```

- 问题

  - 为什么 Object 的方法变指针后可以直接用来 检测类型？

    `toString()` 方法返回一个表示该对象的字符串。这句话的理解可以看下面代码

    ```js
    // object
    Object.prototype.toString() // [object object]
    // array
    Array.prototype.toString() // 预期 [object array] 实际 ''
    [].toString() // ''
    
    ```

    

    array应该返回的是array 为什么直接是 字符串？
    因为不管是array 还是 function 原型上的 toString 方法都被重写了，删除之前重写的方法 会导致 tostring方法重新找到 Object上的内置方法，然后正常返回类型如下

    ```js
    // 删除各对象改写的原型方法
    delete Array.prototype.toString
    delete Function.prototype.toString
    
    // 然后进行使用
    Array.prototype.toString() // [object array] 
    [].toString() // [object array] 
    ```

    

    所以 想用 不被修改的 tostring方法直接 就得 Object.prototype.toString.call()

    MDN 示例代码如下

    ```js
    var toString = Object.prototype.toString;
    
    toString.call(new Date); // [object Date]
    toString.call(new String); // [object String]
    toString.call(Math); // [object Math]
    
    //Since JavaScript 1.8.5
    toString.call(undefined); // [object Undefined]
    toString.call(null); // [object Null]
    ```

    MDN 只是说了用法 却没有说原因 咱们还是不知道为什么这样可以识别类型，继续科学搜索。

    在掘金上有搜到 一篇文章 说了 tostring为什么 会返回类型。 

    - ES5

      因为当一个 值 比如 A 在调用Object的tostring时 ，A值内部的 [[class]] 会被返回出来，这个class 就是js已经定义好的内部属性，值为一个类型字符串，可以用来判断值的类型。

      详细解释

      > 本规范的每种内置对象都定义了 [[Class]] 内部属性的值。宿主对象的 [[Class]] 内部属性的值可以是除了 "Arguments", "Array", "Boolean", "Date", "Error", "Function", "JSON", "Math", "Number", "Object", "RegExp", "String" 的任何字符串。[[Class]] 内部属性的值用于内部区分对象的种类。注，本规范中除了通过 Object.prototype.toString ( 见 15.2.4.2) 没有提供任何手段使程序访问此值。

    - ES6

      > 之前的 `[[Class]]` 不再使用，取而代之的是一系列的 `internal slot`，Internal slots 对应于与对象相关联并由各种ECMAScript规范算法使用的内部状态，它们没有对象属性，也不能被继承，根据具体的 Internal slot 规范，这种状态可以由任何ECMAScript语言类型或特定ECMAScript规范类型值的值组成

      

    

    文章链接 [谈谈 Object.prototype.toString](https://juejin.cn/post/6844903477940846600)

    

## JS中值的存储

> 在存储之前需要熟悉一些概念，比如 栈 比如 堆，以及内存。可以先简单看一下下面的参考文档了解

### 引用类型的存储

分为两部分存储，一个是地址，用栈的方式存储，一个是类型本身 在堆里存储，所以引用类型的赋值 会导致 浅拷贝问题，导致两个变量引用的是同一个值

### 值类型的存储

值类型 直接使用 栈存储的方式存储的，每次赋值都是创建一个新的内存对象，修改取值 赋值也更快

### 不同值得存储所导致得问题

#### 深浅拷贝问题

浅拷贝就是引用值所导致的

- 缺点
  - 会导致值的污染
- 解决方案
  - JSON序列化
    - 缺点
      - 耗时长
      - 会导致 import 引入的东西 和function 都变为字符串
  - 递归解决

## 关于BigInt



## 参考

[Object.prototype.toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

[谈谈 Object.prototype.toString](https://juejin.cn/post/6844903477940846600)

[「前端进阶」JS中的栈内存堆内存](https://juejin.cn/post/6844903873992196110)

[「前端进阶」JS中的内存管理](https://juejin.cn/post/6844903869525262349)

[为什么用Object.prototype.toString.call(obj)检测对象类型?](https://juejin.cn/post/6844903869525262349)

[栈究竟在哪里？](https://www.zhihu.com/question/319926787)

[Stack的三种含义](https://www.ruanyifeng.com/blog/2013/11/stack.html)