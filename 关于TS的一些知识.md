# 被我忽略的TS知识

##  implements 的使用

### 作用

> 对于 类 的行为属性进行 描述，我自己理解就是 class需要定义类型， 所以有了 impements存在，看一下用法 你就知道它的作用了

### 示例

```ts
// 描述行为与属性
interface AType {
    name: string,
    showName: () => void;
}

// class 实现 这个描述
class A implements AType {
    constructor(name:string) {
        this.name = name;
    };

    name: string = '';
    showName() {
        console.log(this.name)
    }
}

// 正常使用
const objA = new A('123');

objA.showName();
```

关于 `type` 类也可以 `implements`

```ts
type BType = {
    age: number,
    showAge: () => void;
}

class B implements BType {
    constructor(age:number) {
        this.age = age;
    }
    age;

    showAge () {
        console.log(this.age+'年龄')
    };
}

const objB = new B(23);

objB.showAge();
```





### 总结

- `class`的type定义 需要用到 `implments`关键字来实现
- `interface`与`type`均可定义class 类型

## 类型保护  type guards 

这个其实在`typescript`官方的高级类型中有写，但是自己学习囫囵吞枣，这一章节的东西直接全部忘了。

### 什么是类型保护？

要知道类型保护，首先要知道 `联合类型（Union Types）`，
现有如下需求：

- 需要一个返回 用户 信息的方法
- 这个方法支持用id 查询 也支持 用姓名查询，id类型为 name 姓名 类型 为string
- id 查询会返回带有id 不带 name的对象信息
- name查询会返回有 name 不带id的对象信息

这个需求中 我们查询参数需要用到 联合类型，返回参数也需要

```ts
type UserId = {
    id: number,
    age: number,
}

type UserName = {
    name: string,
    age: number,
}

function getUserInfo (token: string|number): UserId | UserName {
    if ( typeof token === 'string') {
        return {
            name: token,
            age: 123,
        }
    }

    return {
        id: token,
        age: 123,
    }
}

console.log(getUserInfo(1)); // { id: 1, age: 123 }
console.log(getUserInfo('test')); // { name: 'test', age: 123 }
```

现在方法已经写好 咱们要使用这个方法来进行查询 来判断 是否有id 或者name

```ts
// 报错信息为
/*
类型“UserId | UserName”上不存在属性“id”。
  类型“UserName”上不存在属性“id”。
*/
if (getUserInfo(1).id) {
    console.log(getUserInfo(1).id)
}

// 报错信息为
/*
类型“UserId | UserName”上不存在属性“name”。
  类型“UserId”上不存在属性“name”。
*/
if (getUserInfo('test').name) {
     console.log(getUserInfo('test').name)
}
    
```

上面的报错有问题吗？没问题，因为在你使用联合类型时，ts无法判断你代码未运行的结果，所以进行进行报错，那应该怎么处理？这时候 就需要 `类型保护 type guards`

### 类型保护怎么写？

针对以上代码进行处理如下

```ts
if ((<UserId>getUserInfo(1)).id) {
    console.log((<UserId>getUserInfo(1)).id)
}
    
if ((<UserName>getUserInfo('test')).name) {
    console.log((<UserId>getUserInfo('test')).name)
}
```

当你在`if`语句中告知该函数返回类型时，这样就不会报错 但是 有些麻烦 ，所以咱们使用自定义的类型保护

```ts
function isUserId(obj: UserName|UserId):obj is UserId {
    return (<UserId>obj).id !== undefined;
}

function isUserName(obj: UserName|UserId):obj is UserName {
    return (<UserName>obj).name !== undefined;
}

let idObj = getUserInfo(1);
let nameObj = getUserInfo('test');

if(isUserId(idObj)) {
    console.log(idObj.id);
}

if(isUserName(nameObj)) {
    console.log(nameObj.name);
}
```

这样 就可以 使用 自定义的类型保护 ，来保证TS类型检查 在检查联合类型不会报错，而且会按照预期的类型提示

## 参考链接

* [高级类型 · TypeScript中文网 · TypeScript——JavaScript的超集](https://www.tslang.cn/docs/handbook/advanced-types.html)