# 关于获取xlsx文件数据所需知识

> 在实际开发中遇到的需求，涉及到了特定文件的读取操作，此文章对所用到知识做一次记录

## 需求

- 可以上传 xlsx 数据文件
- 拦截超过指定大小的文件
- 拦截超过指定数据条数的文件
- 获取文件数据

因只有获取到文件数据才可判断数据条数，所以咱们需要先获取数据再进行判断

### 需求中的问题

- 对于文件怎么做类型校验？
- 怎么判断文件大小？
- 怎么通过 input 控件获取到文件中的数据？

## 问题解决

针对上面的需求分析，自己决定写一个小demo 来测试一下，代码如下

```jsx
import { useCallback } from "react";
import "./App.css";

function App() {
  const onChange = useCallback(
    (e) => {
      // 获取数据
      console.log(e);
    },
    []
  );

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" onChange={onChange} multiple={false} />
      </header>
    </div>
  );
}

export default App;
```

页面截图

![image-20220115150405139](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20220115150405139.png)

### 文件的类型检验

常用文件校验中，咱们可以通过以下两种方式来进行限制

- `input`中的`type`字段和`accept`字段组合
  - 当 `type=file`时，`accept`字段录入`MIME_type`值可对文件进行过滤
- `change`事件获得的事件对象中有`file`数据，可通过数据中的`type`字段判断

在写代码之前需要说一下前置知识，关于`accept`录入的`MIME_type`字段到底是什么？

> `MIME_type`所使用的值来源于 web通用应用类型 `Media Types`，这个类型是由IANA官方机构所维护的

官方维护了一张所有应用类型对应的表 [list of all the official MIME types](https://www.iana.org/assignments/media-types/media-types.xhtml)，咱们参照`MDN`上的找到咱们需要 `xlsx`后缀所对应的类型，[常见 MIME 类型列表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)，为

| `.xlsx` | Microsoft Excel (OpenXML) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| ------- | ------------------------- | ------------------------------------------------------------ |
|         |                           |                                                              |

按照第一种方式修改`jsx`代码如下

```jsx
 return (
    <div className="App">
      <header className="App-header">
        <input
		type="file"
		accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
         onChange={onChange}
         multiple={false}
         />
      </header>
    </div>
  );
```

在实测后发现，虽然控件进行了限制，但是用户可通过电脑文件操作选择其他类型的文件，如下图

![image-20220115154846900](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20220115154846900.png)

选择所有文件后，可以继续选择其他类型的文件，所以咱们使用第二种方式进行容错处理

对于`onchange `方法做以下修改

```jsx
const onChange = useCallback(
    (e) => {
      // 获取数据
      const filesData = e.target.files[0];

      if(filesData.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        alert('你选择错了！');
        return;
      };

      console.log(e.target.files);
    },
    []
  );
```

这样就解决了文件类型校验的问题

### 文件大小校验

这个就比较简单了直接用`files`对象中的`size`大小进行判断，需要注意

- `size`大小的单位是字节`Byte `,判断时需要进行单位转换，比如我判断是是否超过10KB，那么我10KB需要转化为 `10 * 1024`

代码修改如下

```jsx
const onChange = useCallback(
    (e) => {
      // 获取数据
      const filesData = e.target.files[0];

      if(filesData.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        alert('你选择错了！');
        return;
      };
        
      if(filesData.size > (10 * 1024)) {
        alert('文件过大!');
        return;
      }

      console.log(e.target.files);
    },
    []
  );
```

### 获取文件数据

到现在咱们仅仅是能拿到 文件的 `files`对象，而`files`对象并没有咱们平常操作的数据结构 和文件中的数据，这个时候就需要用到一个库`xlsx`,来对文件数据进行操作

安装依赖

```shell
yarn add xlsx
```

查看xlsx文档发现，它并不支持 `files`对象的数据读取，但是支持以下几个类型

| `type`     | expected input                                             |
| ---------- | ---------------------------------------------------------- |
| `"base64"` | string: Base64 encoding of the file                        |
| `"binary"` | string: binary string (byte `n` is `data.charCodeAt(n)`)   |
| `"string"` | string: JS string (characters interpreted as UTF8)         |
| `"buffer"` | nodejs Buffer                                              |
| `"array"`  | array: array of 8-bit unsigned int (byte `n` is `data[n]`) |
| `"file"`   | string: path of file that will be read (nodejs only)       |

所以咱们需要把 `files`数据对象转化为咱们可用数据，在转化之前需要先看一下 `files`这个对象中到底包含哪些东西，可获取数据如下

![image-20220115163541773](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20220115163541773.png)

```js
File: {
    lastModified: '最后修改时间戳',
    lastModifiedDate: '最后修改时间对象',
    name: '文件名称',
    size: '字节大小',
    type: '对应的MIME_type值',
    webkitRelativePath: '它规定了文件的路径，相对于用户在 <input> 元素中选择的目录，这个元素设置了 webkitdirectory 属性。还未实现这个功能'
}
```

`File`为Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，是一个标准对象，可以通过 `FileReader`构造函数完成 `Buffer`,`DataURL`等类型的转化，咱们需要用到`buffer`类型数据，文档参考如下

![image-20220115170906185](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20220115170906185.png)

代码如下：

```jsx
const fileObj = new FileReader();
fileObj.onload = function (data) {
    console.log(data);
};
reader.readAsArrayBuffer(fileData);
```

`xlsx`再对`Buffer`类型数据进行读取 ，如下

```jsx
const data = xlsx.read(bufferData, {
      type: "buffer",
      cellHTML: false,
    });
```

 咱们把代码进行整合看一下最后得输出结果，代码如下

```jsx
import { useCallback } from "react";
import * as xlsx from "xlsx";
import "./App.css";

function App() {
  // file对象转为Buffer数据
  const fileDataPaserBuffer = useCallback((fileData) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        res(e);
      };
      reader.readAsArrayBuffer(fileData);
    });
  }, []);

  // xlsx读取buffer数据
  const readTableDataBuffer = useCallback((data) => {
    return xlsx.read(data, {
      type: "buffer",
      cellHTML: false,
    });
  }, []);

  const onChange = useCallback(
    (e) => {
      // 获取数据
      const filesData = e.target.files[0];

      if(filesData.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        alert('你选择错了！');
        return;
      };

      if(filesData.size > (20 * 1024)) {
        alert('文件过大!');
        return;
      }

      fileDataPaserBuffer(e.target.files[0]).then(res => {
        const result = readTableDataBuffer(res.target.result)
        console.log(result)
      })
    },
    [fileDataPaserBuffer, readTableDataBuffer]
  );

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onChange} multiple={false} />
      </header>
    </div>
  );
}

export default App;
```

查看输出

![image-20220115171742069](C:\Users\7\AppData\Roaming\Typora\typora-user-images\image-20220115171742069.png)

已得到JS可以操作的数据结构，剩下就是对数据进行整理和判断

## 参考文档

[如何优雅的处理前端开发中的File](https://segmentfault.com/a/1190000022999340)

[ js-xlsx模块学习指南](https://segmentfault.com/a/1190000018077543)

[FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)