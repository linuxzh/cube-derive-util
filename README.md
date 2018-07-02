# 文件下载功能组件 cube-derive-util

> `cube-derive-util`将需要下载的数据转成相应文件格式的Buffer数据，并且携带header。通过浏览器解析返回的Buffer数据，完成文件下载。

## 目录

* [安装](#安装)
* [参数](#参数)
  - [注意事项](#注意事项)
* [实例](#实例)
* [缺陷](#缺陷)
* [贡献者](#贡献者)
   - [首席维护](#首席维护)
   - [核心开发](#核心开发)

### 安装

* 进入自己的项目的 `server` 目录，使用 `yarn add cube-derive-util` 安装服务端依赖。

### 参数
```js
downloadFile(
  reply,
  {
    dataBody,
    header,
    type,
    options
  });
```

| 参数项 | 解释 | 默认值 |
| ----- | ------ | ------ |
| reply | routes 中 handler 的 reply |  |
| dataBody | 需要导出的数据 | 无 |
| header | 指定导出文件的文件头 | 无 |
| type | 指定导出文件类型 | csv |
| options | 配置文件名，目前只有excel可配置行高列宽 |
| options.wsrows | 设置每一行的高度，单位为 px | 10像素 |
| options.wscols | 设置每一列的宽度，单位为 px | 100像素 |
| options.fileName | 设置导出文件的文件名 | knownsec |

#### 注意事项

* `header` 中的数据项 `text` 中英文都可以，只需要满足 `header` 与 `dataBody` 中的 `key` 对应即可。

* `header` 和 `dataBody`存在关联，必须满足一定的数据格式，`dataBody`数组中的每一个对象的`key`是`header`中的元素，如下：

```js
header: [
  {
    key: 'name'
    text: '姓名'
  },
  {
    key: 'age'
    text: '年龄'
  },
  {
    key: 'gender'
    text: '性别'
  },
  {
    key: 'enjoy'
    text: '爱好'
  },
]
dataBody: [
  {
    'name': 'zhangxueyou',
    'age': '18',
    'gender': 'male',
    'enjoy': 'basketball'
  },
  {
    name: 'liudehua',
    age: '18',
    gender: 'female',
    enjoy: 'baseball'
  },
  ......
]
```

### 实例

* 首先，这个方法直接在你的controller中 import ，传入相应参数，即可想用文件下载的功能。
* 引入方法

  ```js
  import downloadFile from 'cube-derive-util';
  ```

* 使用

  ```js
  // 在某一个 controller 中，将查询到的数据导出为文件
  export const outuputCountries = async(request, reply) => {
    
    const { type } = request.query; // type='xlsx'
    // 假如现在我们已经通过一些查询接口得到类似于上面的数据
    downloadFile(reply, {
      dataBody,
      header,
      type,
      options: {
        fileName: '全球国家名字',
      },
    });
  };
  ```
* 结果

  你将会下载一个 `全球国家名字.xlsx` 文件，文件内容如下：

| 姓名 | 年龄 | 性别 | 爱好 |
| ----- | ------ | ------ | ------ |
| zhangxueyou | 18 | male | basketball |
| liudehua | 18 | female | baseball |


### 支持功能

* 目前只可以支持将数据导出成`csv`和`xslx`文件格式。

## 贡献者

### 首席维护

  * [范世德](https://github.com/FanShiDe) <https://github.com/FanShiDe>

    <a href="https://gitlab.intra.knownsec.com/fansd" target="_blank"><img style="border-radius:50%" src="https://avatars2.githubusercontent.com/u/21983486?s=400&u=8dad083d099f2fb815f9573e3278703943d50a5e&v=4"></a>

### 核心开发

  * [范世德](https://github.com/FanShiDe) <https://github.com/FanShiDe>

