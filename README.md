# DPL

## 一，开发环境：

### Grunt

之前的make脚本已经被改成grunt，除了常规的[grunt安装](http://gruntjs.com/)，还需要安装[hogan](http://twitter.github.io/hogan.js/)用来编译文档模板。grunt 中已经配置了如下几个任务:

* dist:编辑css和js,包含两个任务dist-js和dist-css
* docs:编译文档, 因为依赖关系，所以编译文档实际上也会执行dist
* test:代码检查和单元测试
* default:默认任务，等价于 test + dist
* watch:监控文件改动实时编译

### Gulp

Gulp 和 Grunt 一样也是用来构建代码。Gulp 基于nodejs的stream来做的，区别于Grunt完全基于配置，所以更加灵活方便，能用更少更优雅的代码实现复杂的功能。Gulp应该会在不久之后取代Grunt成为前端最好的构建工具(**Task Runner**)。Gulp 官网地址：[Gulp](https://github.com/gulpjs/gulp)。
目前用 Gulp 实现了Grunt中的全部任务，但是qunit还有bug。现在两个工具并存，并不存在冲突，等gulp社区成熟稳定之后就可以删掉grunt了。**目前还是以Grunt为主**。

gulp 默认配置了default和watch两个主要任务。

### iconfont
icon全部用iconfont实现，整个dpl不需要任何图片资源。目前的font-face是从3.0版本cp过来的，命名依然沿用3.0的命名。 
而且icon font 是文字，所以可以调大小颜色等。

### git协作：

master不用来开发代码。
每个人新建一个自己的分支，比如开发btn的分支就叫btn，开发完成后向master发送一个merge request，另一个同学review完代码之后点击merge即可提交到master。
重要阶段就打一个tag。 

开发时候只需要执行 **grunt watch** 就可以，会自动编译代码并刷新页面。最后提交的时候要执行 **grunt test** 保证没有错误再提交。


## 二，文件结构：
- bootstrap: 编译后的js和css文件，这个被gitignore，执行grunt会自动生成。
- docs：文档，文档是用mustache模板写的，mustache是一个无逻辑模板语言（官网：http://mustache.github.io/），用twitter自己写的一个编译器hogan来编译（http://twitter.github.io/hogan.js/）。
docs中注意如下几个文件：
  - assets：只在docs中使用的静态文件放这里，和bootstrap代码相关的比如bootstrap.css和fonts是从外面cp进来的。
  - demos: 每个组件自己的demo，开发一个组件就在这里新建一个demo，这里用的是jade模板生成的，执行grunt docs会自动把docs/template下的jade模板编译到docs目录下的同名文件。其中base.jade是公用模板，其他模板都应该继承base。如果模板名字以com-开头或者以-com.jade结尾，则不会被编译为html，适合中间组件.
  - example：示例，这个是没有用模板来写的，后面如果有必要我会用mustache改造一下。每完成一个组件都应该在这里面写一个详细的例子（或者在less下面建一个demo文件夹更好点？）。
  - template：官网页面，这个是用mustache来写的，里面有一个layout和若干pages，以后我们的官网也按照这个模式来写。

- fonts: 字体描述文件，icon font字体是支持包括ie6在内的所有主流浏览器，只是每个浏览器支持的字体描述文件格式不同，这里提供了全部四种格式。但是因为icon用了:before和content来实现，所以ie8以下的浏览器还是不支持的。
- less：css源码（注意这里面的test没有测试框架的支持，人肉检查组件而已）
模块结构可以在bootstrap.less中看的非常清楚，直接看bootstrap.less的代码。

- js：重点注意单元测试，需要先学习qunit的用法。每一个js模块都对应一个单元测试。js代码的提交一定要通过单元测试。grunt test或者直接访问index.html都可以。（目前grunt qunit会有一个超时bug，暂时去掉了）


##  css组件规范：

1. 尺寸规范：
元素的尺寸由line-height,padding,border,margin组成，还有不影响元素本身大小的是font-size
所以广义的元素尺寸包括了上述五个因素。
我们把组件都分成四种大小：mini,small,default,large。这四种大小分别对应四种不同的font-size,line-height,padding,border和margin，这些是在variables中已经定义好的。
一些基础css组件可能包含全部的四种尺寸，比如btn和input，大部分组件都是其中一种尺寸。
当然很多时候一个组件无法对应这四种尺寸之一，那就直接写死常量。
这方面bootstrap做的不好，大部分都是写死在代码中的常量。

2. 颜色规范：
常用的颜色可能就十几种，定义在variables中，其他颜色最好能根据常用颜色算出来。这样换皮肤的话只需要把颜色配置换掉就好了。
比如btn-primary的颜色是这么定义的：
@btnPrimaryBackground:              @linkColor;
@btnPrimaryBackgroundHighlight:     spin(@btnPrimaryBackground, 20%);

3. 浏览器分级
对浏览器分ABC级：
A: 最优体验，视觉和功能完全保证
B: 功能保证，无法保证视觉美观
C: 不兼容


4. 命名规范：

- css中除了变量用驼峰法，其他都是’-‘分割（3.0全部改成减号分割）
- 一个组件有不同的样式，应该把每一种样式都作为一个追加的classname，而不是修改原有的class。即 .btn.btn-primary，而不是直接用.btn-primary替换.btn
最重要的是语义化命名，参见后文。

## js 插件开发规范：

## js：单元测试：
TODO


## 优先开发的模块：
TODO：原则是按照bootstrap.less中的顺序开发（去掉不用的组件），因为组件是有依赖关系的
