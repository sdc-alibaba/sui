# DPL

## 一，开发环境：

### Grunt

之前的make脚本已经被改成grunt，除了常规的[grunt安装](http://gruntjs.com/)，还需要安装[hogan](http://twitter.github.io/hogan.js/)用来编译文档模板。grunt 中已经配置了如下几个任务:

* dist:编辑css和js,包含两个任务dist-js和dist-css
* docs:编译文档, 因为依赖关系，所以编译文档实际上也会执行dist
* test:代码检查和单元测试
* default:默认任务，等价于 test + dist
* watch:监控文件改动实时编译

**因为一个未解决的bug，暂时去掉了js单元测试，解决bug之后再加上**

### iconfont
icon全部用iconfont实现，整个dpl不需要任何图片资源。目前的font-face是从3.0版本cp过来的，命名依然沿用3.0的命名。 
而且icon font 是文字，所以可以调大小颜色等。

### git协作：

master不用来开发代码。
每个人新建一个自己的分支，比如开发btn的分支就叫btn，开发完成后向master发送一个merge request，另一个同学review完代码之后点击merge即可提交到master。
重要阶段就打一个tag。 


## 二，文件结构：

▾ bootstrap/
  ▾ css/
  ¦ ¦ bootstrap.css
  ¦ ¦ bootstrap.min.css
  ▾ js/
  ¦ ¦ bootstrap.js
  ¦ ¦ bootstrap.min.js
▾ docs/
  ▸ assets/
  ▸ build/
  ▸ examples/
  ▸ templates/
  ¦ base-css.html
  ¦ components.html
  ¦ customize.html
  ¦ extend.html
  ¦ getting-started.html
  ¦ index.html
  ¦ javascript.html
  ¦ scaffolding.html
▸ fonts/
▸ js/
▸ less/
▸ node_modules/
  bower.json
  CHANGELOG.md
  composer.json
  CONTRIBUTING.md
  Gruntfile.js*
  LICENSE
  Makefile
  package.json
  README.md


- bootstrap: 编译后的js和css文件，这个被gitignore，执行grunt会自动生成。
- docs：文档，文档是用mustache模板写的，mustache是一个无逻辑模板语言（官网：http://mustache.github.io/），用twitter自己写的一个编译器hogan来编译（http://twitter.github.io/hogan.js/）。
docs中注意如下几个文件：
assets：只在docs中使用的静态文件放这里，和bootstrap代码相关的比如bootstrap.css和fonts是从外面cp进来的。
example：示例，这个是没有用模板来写的，后面如果有必要我会用mustache改造一下。每完成一个组件都应该在这里面写一个详细的例子（或者在less下面建一个demo文件夹更好点？）。
template：官网页面，这个是用mustache来写的，里面有一个layout和若干pages，以后我们的官网也按照这个模式来写。
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

编写jquery插件其实非常简单，代码结构也比较固定，只需要注意闭包和$.extends的使用即可。
下面以一个非常简单的higher插件来讲解jquery插件的编写过程。
higher插件作用是：当鼠标移到元素上时，高度变高，移走之后恢复。


首先，我们需要一个闭包来封装代码，避免污染window：
然后 我们需要把自己的插件添加到jquery的原型，即$.fn上，直接使用$.fn.extend方法即可：
当然，如果你不想用extend，直接添加 $.fn.pluginName来添加也行。
接下来就是一般插件都需要做的，提供对多个元素的支持。因为jquery选择器很可能会选择多个元素，我们需要提供对多个元素的支持，这里就需要用到 this.each方法来遍历选中的元素：

    (function($) {
         $.fn.extend({
              pluginName: function() {
                   return this.each(function() {
                        // here is your code
                   });
              }
         })
    })(jQuery);

至此，基本结构已经完成，下面就是如何实现插件的逻辑。
在实现上要注意利用闭包隐藏私有方法，然后注意一般如何使用options和defaults，最后还要加上一行自动加载的代码。这里，我们执行高度计算的函数是一个私有函数higher，整个插件代码如下：

    (function($) {
        // 私有方法放在这里

        var higher = function (h, percent) {  
            return h * (100+percent) / 100;
        }
        
        // 拓展jquery 原型
        $.fn.extend({
            higher: function(options) {
                var defaults = {     // 默认设置
                    percent: 20
                };
               
                var settings = $.extend(defaults, options);
                return this.each(function() {     //遍历dom
                    var $this = $(this);
                    var old_ = $this.height();
                    var new_ = higher(old_, settings.percent)
                    $this.on("mouseover", function() {
                        $this.height(new_);
                    });
                    $this.on("mouseout", function() {
                        $this.height(old_);
                    });
                });
            }
        });
         
        //自动加载, 这里还可以加上从data属性中读取配置
         $(“.dpl-heigher”).higher();
    })(jQuery)

最后这样使用插件：
$('xxx').higher();
$('xxx').higher({percent:50}); 

## js：单元测试：
TODO


## 优先开发的模块：
TODO：原则是按照bootstrap.less中的顺序开发（去掉不用的组件），因为组件是有依赖关系的


## 开发上需要注意的几个地方：

### DRY， Don’t Repeat Yourself

不要复制粘贴代码。
通过良好的代码结构、变量、mixin等方法。

常用的变量全部放到variable.less文件中，包括：字体、颜色、margin/padding/line-height等。variables中有的变量不要在自己的组件中再重复了。

多用相对值来定义，比如btn-primary只有一个基础颜色，hover active等状态是通过基础颜色算出来的。font-size, line-height等都是这样的。

多用mixin，任何copy操作之前都要三思。mixin里面定义了很多常用的方法，不够的还可以自己加。（这里bootstrap的设计还有待商榷，很多mixin都是只有一个模块在用，这种专用的mixin应该放在mixin文件中还是应该放在模块内部定义？）

通用的写法：
比如btn:active会有一个按下的阴影效果，直接写阴影就不如用一个半透明的浮层盖上去效果更好。

### OOCSS
面向对象css最重要的一点是：把html和css结合起来当做一个对象（或者叫组件）来看待。
即面向对象css：封装，继承，多态

#### 封装
一个dom结构很复杂的组件，最好只给最外层的容器添加一个class既可以改变整个显示效果，而不用对内部元素做任何改动，容器上的classname就是对外的接口。
比如这个

    <div class=‘input-control’>
         <label for=''>username</label>
         <input />
         <span class=‘helper’>不能为空</span>
    </div>

其中只需要在input-control上添加类似error/warning/info之类的classname既可以控制其中input和span的样式。

#### 继承
比如我们有统一的icon.less里面定义了icon-error，然后表单验证的时候也会用到icon-error的样式，但是上面说了，不应该让用户自己去加icon-error这个class来实现，应该怎么办？
比如dom结构如下：

    <div class=‘input-control error’>
         <label for=''>username</label>
         <input />
         <span class=‘helper’><i class=‘icon’></i>不能为空</span>
    </div> 

对应的css应该是这样的

    .input-contorl {
         &.error {
              .icon {
                   .icon-error; #继承或者叫混入icon-error的样式，不要copy代码，也不要改icon-error
              }
         }
    }

#### 多态
面向接口编程，比如一个按钮btn，btn只是一个接口，具体的实现是由另外的class来决定的，而且会有各种不同的实现方式：btn-default, btn-danger, btn-warning。

### 语义化
dom结构语义化：
比如一个异步提交的搜索功能，最好依然用form来写，只是在js中拦截submit事件。或者一排点击都会高亮选中的标签，应该用radio/checkbox而不是通过js操作隐藏input来实现。
比如btn-disabled，同时要兼顾 disabled属性。
命名语义化：
即使是css模块，也是按功能划分而不是按样式划分的。一个模块代表一个功能，所以不用表现形式而要用功能来命名，比如btn-blue是不对的，应该用他的功能btn-primary来命名。否则一旦换个主题颜色就会出现btn-blue是红色/蓝色的情况。

### 依赖声明
每个模块都要显式声明自己的依赖，每个模块都可以独立编译。避免间接依赖。
bootstrap中js和less中都是有依赖关系，但是没有声明依赖，而是通过打包文件的顺序来解决的，这是我们可以改进的地方。具体做法是，在每一个css模块中加上import，用requirejs/seajs声明js依赖。

