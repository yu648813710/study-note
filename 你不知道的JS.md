# 你不知道的JS

### 编译原理

> 一个编程语言的重点在于对于存储变量的值，然后对于变量进行修改访问

#### 编译步骤

- 分词/词法分析

  把词法单元识别出来，把编写的代码分成一个个关键字。比如 var a = 2 就分为 var ， a, = , 2

- 解析/语法分析

  将关键字转化为一个程序语法结构树，树叫“抽象语法树“AST

- 代码生成

  将AST转为一组机器指令，用来创建一个a的变量，将2 存储在a中

### 作用域

- 负责收集并维护所有声明的标识符也就是变量，确定当前执行的代码对这些变量的访问权限

### 词法作用域

> 用来知晓词法是在哪一个阶段有用的

- 查找

  如果当前作用域找到词法，后面就不会再找了，没找到就直到找到全局有的话就有，没有就报错。

  如果是 foo.a.b 词法作用域就只找一级，后面的是对象访问规则的事情

### 欺骗语法

- 使用eval（）函数进行语句插入，会导致变量作用域改变，不安全，而且消耗性能
- 使用with（）直接给对象某个以及有了的key赋值，如果没有key会直接赋给当前使用with的函数所处的作用域，很混乱，而且消耗性能

### 函数的作用域

> 函数都会自己创建一个作用域

- 是为了最小授权以及最小暴露原则
-  区分函数声明和表达式最简单的方法是看function关键字出现在声明中的位置（不仅仅是一行代码，而是整个声明中的位置）。如果function是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式

