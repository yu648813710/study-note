# TS学习笔记

## 剩余参数

> 可以直接 把多余参数组合为数组 输出

```js
const Mnum = function (a: number, b: number, ...resulte: number[]): number {
    let num = a + b;
    resulte.forEach(res => {
        num += res;
    })
    return num;
}

console.log(Mnum(1, 2, 3)); //6

console.log(Mnum(1, 2, 3, 4 ,5)); //15
```

