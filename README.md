# webpack-vue-mpa

> 项目描述

## Features

1. [Vue2](https://github.com/vuejs/vue)
2. [Webpack4](https://github.com/webpack/webpack)
3. [Vux](http://vux.li/)
4. [Eslint](https://github.com/eslint/eslint)
5. [Postcss](https://github.com/postcss/postcss)

## 启动本地开发环境（Develoment）

``` bash
# 启动带有hot reload的开发服务（serve with hot reload at localhost:8010）
npm run dev
# 如果你想自动打开demo url
npm run dev:open
```

[手动访问demo url](http://localhost:8010/demo.html)

## 编译（Build）

### 编译项目（Build the project）
共有三种编译选项，满足测试和生产的发布需求
``` bash
# 编译适用于测试环境的代码（build for staging）
npm run build:staging
# 如果你想顺便打个zip包……
npm run build:staging:zip

# 编译适用于测试环境的代码并压缩（build for staging with minification）
npm run build:staging:minify

# 编译适用于生产环境的代码（build for production with minification）
npm run build:prd
# 如果你想顺便打个zip包……
npm run build:prd:zip
```

### 启动[web service api](src/assets/business/wsapi.js)数据挡板服务
并顺便对[dist](dist)启动web服务(Start a example web+mock server)

``` bash
npm run mock
```

[访问编译后的demo url](http://localhost:2333/demo.html)

### 编译性能分析

#### Minimal build size of basic requirement
The build size with basic requirement on Chrome 66
* webpack 1.2k
* webpack + vue ~60k
* webpack + vue + vux ~86k
* webpack + vue + vux + lodash ~94k

#### 编译后的包大小分析（Analysis bundle size）
``` bash
npm run build:profile
```

## Webstorm无法对import中的别名路径进行解析
Webstorm默认寻找项目根路径下的webpack.config.js中resolve.alias配置，但是当前工程配置相对复杂，
已将他们全部移动build/下面，并将alias配置单独提取出来为webpack.resolver.js。

### 配置建议
依次打开Webstorm设置，找到Settings | Languages & Frameworks | JavaScript | Webpack，并将webpack configuration file路径指向webpack.alias.js文件

可选方案可以查看 [Path aliases for imports in WebStorm](https://stackoverflow.com/questions/34943631/path-aliases-for-imports-in-webstorm)

## 源码目录结构（Root Folder Structure）
采用“分而治之”工程理念来管理资源。

为什么要组件化开发？可以看看 [前端工程——基础篇](https://github.com/fouber/blog/issues/10)的“第一件事：组件化开发”部分。

```bash
├── src  # 源码目录
│   ├── assets # 公共静态资源目录
│   │   ├── img # 公共图像资源，通常情况下，UI组件自己管理自己的图像资源
│   │   ├── lib # js模块
│   │   ├── business # 公共业务组件
│   │   └── plugins # vue plugin 用来创建vue component的js调用方式
│   ├── components # 公共ui组件
│   └── pages  # 页面资源目录
│       ├── demo # demo.html (目录名称可修改)
│       │   ├── app.js   # js入口文件entry file (编译脚本中约定的命名，不可修改)
│       │   └── app.html # 与入口文件对应的html模板 (编译脚本中约定的命名，不可修改)
│       └── user # 分模块划分页面例子
│           ├── login
│           │   ├── business.js # 页面独有业务逻辑（命名可以修改）
│           │   ├── app.js   #
│           │   └── app.html #
│           ├── logout
│           │   ├── app.js   #
│           │   └── app.html #
│           ├── page.vue   # 子页面共享page.vue（命名可以修改）
│           └── business.js # 子页面共享业务逻辑（命名可以修改）
├── LICENSE
├── .babelrc          # babel config (es2015 default)
├── .eslintrc.js      # eslint config (eslint-config-vue default)
├── mock/server.js    # 默认端口 2333
├── package.json
├── postcss.config.js # postcss (autoprefixer default)
└── README.md
```

## 编译后的资源目录结构（Dist Folder Structure）
该目录下的资源用于部署或发布

```bash
│  favicon.ico
│  index.html
│
└─assets
    ├─css
    │      index.css
    │
    ├─img
    │      1.f5d47c6.jpg
    │      2.5520ed6.jpg
    │      3.379ed6d.jpg
    │      android.24c4532.gif
    │      ios.2d7a9bb.gif
    │
    └─js
            0.js
            0.js.map
            1.js
            1.js.map
            2.js
            2.js.map
            3.js
            3.js.map
            4.js
            4.js.map
            5.js
            5.js.map
            6.js
            6.js.map
            index.js
            index.js.map
```

For detailed explanation on how things work, checkout the [guide](https://github.com/Plortinus/vue-multiple-pages)

# FAQ
## 无法覆盖组件库的css
在web-dev-server启动后的开发场景中，css的加载顺序是无法保障的。
主要原因是现在打包工具无法跟踪和管理css之间的依赖关系，并且样式是全局性的，
如果编写者没有注意作用域问题，就会带来组件间样式互相影响隐患，
vue为此提供了[style scoped](https://vue-loader-v14.vuejs.org/zh-cn/features/scoped-css.html)的解决方案，更成熟的方案可以参考[css modules](https://vue-loader-v14.vuejs.org/zh-cn/features/css-modules.html)

针对本项目的实际情况，我们可以参照一下优先级顺序来调整我们的css
> css 的优先级：!important > 行内样式 > id > class > tag > * > 继承 > 默认

**举个例子：**

假设有组件如此声明样式
```css
.vux-slider > .vux-indicator {
  bottom: 10px;
}
```

* 限定作用域
```css
.main-box .vux-slider > .vux-indicator {
  button: 5px;
}
```
推荐写法，限定作用于，有scope的概念，减少对全局的影响。

* 重复类选择器
```css
.vux-slider > .vux-indicator.vux-indicator {
  button: 5px;
}
```

* 标注更高优先级
```css
.vux-slider > .vux-indicator {
  bottom: 10px !important;
}
```
*不推荐，这会使css难以修改*

* 使用行内样式
```html
<div class="vux-slider">
  <a class="vux-indicator" style="bottom: 10px"></>
</div>
```

以上三种写法都可以覆盖组件样式，请酌情使用。

问题相关链接：
* [CSS incorrect order](https://github.com/webpack-contrib/sass-loader/issues/318)
* [Feature Request: add a "priority" option to allow defining the order of style blocks](https://github.com/webpack-contrib/style-loader/issues/17)
* [How can I keep the css order in the css file when I use extract-text-webpack-plugin？](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/200)
