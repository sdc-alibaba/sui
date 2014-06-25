/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict";


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  //element为触发元素，如标识文字链
  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true
      this.hoverState = 'out'

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))

        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      var foot = options.type == 'confirm' ? '<div class="tooltip-footer"><button class="sui-btn btn-primary" data-ok="tooltip">确定</button><button class="sui-btn btn-default" data-dismiss="tooltip">取消</button></div>' : ''
      //根据tooltip的type类型构造tip模版
      options.template = '<div class="sui-tooltip ' + options.type + '" style="overflow:visible"><div class="tooltip-arrow"><div class="tooltip-arrow cover"></div></div><div class="tooltip-inner"></div>' + foot + '</div>'
      options.type == 'confirm' && (options.html = true)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      clearTimeout(self.timeout)
      if (this.hoverState == 'out') {
        this.hoverState = 'in'
        this.tip().off($.support.transition && $.support.transition.end)
        if (!this.options.delay || !this.options.delay.show) return this.show()
        this.timeout = setTimeout(function() {
          if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
      }
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      this.timeout = setTimeout(function() {
        //isHover 为0或undefined，undefined:没有移到tip上过
        if (!self.isTipHover) {
          self.hoverState = 'out'
        }
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')
        , opt = this.options
        , align = opt.align
        , self = this

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (opt.animation) {
          $tip.addClass('fade')
        }

        placement = typeof opt.placement == 'function' ?
          opt.placement.call(this, $tip[0], this.$element[0]) :
          opt.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        opt.container ? $tip.appendTo(opt.container) : $tip.insertAfter(this.$element)
        if (/\bhover\b/.test(opt.trigger)) {
          $tip.hover(function(){
            self.isTipHover = 1
          }, function(){
            self.isTipHover = 0
            self.hoverState = 'out'
            $tip.detach()
          })
        }
        this.setWidth()
        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        //+ - 7修正，和css对应，勿单独修改
        var d = opt.type == 'attention' ? 5 : 7
        tp = positioning();
        this.applyPlacement(tp, placement)
        this.applyAlign(align, pos)
        this.$element.trigger('shown')
      }
      //确定tooltip布局对齐方式
      function positioning (){
        var _left = pos.left + pos.width / 2 - actualWidth / 2
          , _top = pos.top + pos.height / 2 - actualHeight / 2
        switch (align) {
          case 'left':
            _left = pos.left
            break
          case 'right':
            _left = pos.left - actualWidth + pos.width
            break
          case 'top':
            _top = pos.top
            break
          case 'bottom':
            _top = pos.top - actualHeight + pos.height
            break
        }
        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height + d, left: _left}
            break
          case 'top':
            tp = {top: pos.top - actualHeight - d, left: _left }
            break
          case 'left':
            tp = {top: _top, left: pos.left - actualWidth - d}
            break
          case 'right':
            tp = {top: _top, left: pos.left + pos.width + d}
            break
        }
        return tp
      }

    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }
  , applyAlign: function(align, tipPos){
      var $tip = this.tip()
      , actualWidth = $tip[0].offsetWidth
      , actualHeight = $tip[0].offsetHeight
      , css = {}
      switch (align) {
        case 'left':
          if (tipPos.width < actualWidth)
            css = {left: tipPos.width / 2}
          break
        case 'right':
          if (tipPos.width < actualWidth)
            css = {left: actualWidth - tipPos.width / 2}
          break
        case 'top':
          if (tipPos.height < actualHeight)
            css = {top: tipPos.height / 2}
          break
        case 'bottom':
          if (tipPos.height < actualHeight)
            css = {top: actualHeight - tipPos.height / 2}
          break
      }
      align != 'center' && $tip.find('.tooltip-arrow').first().css(css)
 
  }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setWidth: function() {
      var opt = this.options
        , width = opt.width
        , widthLimit = opt.widthlimit
        , $tip = this.tip()
      //人工设置宽度，则忽略最大宽度限制
      if (width) {
        $tip.css('width', width)
      } else { 
        //宽度限制逻辑
        if (widthLimit === true) {
          $tip.css('max-width', '400px')
        } else {
          var val
          widthLimit === false && (val = 'none')
          typeof opt.widthlimit == 'string' && (val = widthLimit)
          $tip.css('max-width', val)
        }
      } 
  }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var $tip = this.tip()
        , e = $.Event('hide')
        , self = this
        , opt = this.options

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')
      if (typeof opt.hide == 'function') {
        opt.hide.call(self.$element)
      }

      function removeWithAnimation() {
        self.timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(self.timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        ($tip.detach())
      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      //只有无js激活方式才处理title属性。同时html属性data-original-title必须附加到触发元素,即使是js调用生成的tooltip。
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        if ($e.data('toggle') == 'tooltip') {
          $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        } else {
          $e.attr('data-original-title', '')
        }
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)
      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {

    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , type: 'default'   //tip 类型 {string} 'default'|'attention'|'confirm' ,区别见demo
  , placement: 'top'
  , selector: false  //通常要配合调用方法使用，如果tooltip元素很多，用此途径进行事件委托减少事件监听数量: $('body').tooltip({selector: '.tips'})
  , trigger: 'hover focus'   //触发方式，多选：click hover focus，如果希望手动触发，则传入'manual'
  , title: 'it is default title'  //默认tooltip的内容，如果给html元素添加了title属性则使用该html属性替代此属性
  , delay: {show:0, hide: 200}   //如果只传number，则show、hide时都会使用这个延时，若想差异化则传入形如{show:400, hide: 600} 的对象   注：delay参数对manual触发方式的tooltip无效
  , html: true  //决定是html()还是text()
  , container: false  //将tooltip与输入框组一同使用时，为了避免不必要的影响，需要设置container.他用来将tooltip的dom节点插入到container指定的元素内的最后，可理解为 container.append(tooltipDom)。
  , widthlimit: true  // {Boolean|string} tooltip元素最大宽度限制，false不限宽，true限宽300px，也可传入"500px",人工限制宽度
  , align: 'center'  // {string} tip元素的布局方式，默认居中：'center' ,'left','right','top','bottom'
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

  //document ready init
  $(function(){
    $('[data-toggle="tooltip"]').tooltip()

    //mousedown外部可消失tooltip(为了在click回调执行前处理好dom状态)
    $(document).on('mousedown', function(e){
      var tgt = $(e.target)
        , tip = $('.sui-tooltip')
        , switchTgt = tip.prev()
        , tipContainer = tgt.parents('.sui-tooltip')
      /* 逻辑执行条件一次注释：
       * 1、存在tip
       * 2、点击的不是tip内的某区域
       * 3、点击的不是触发元素本身
       * 4、触发元素为复杂HTML结构时，点击的不是触发元素内的区域
       */
       // 这里决定了data-original-title属性必须存在于触发元素上
      if (tip.length && !tipContainer.length && tgt[0] != switchTgt[0] && tgt.parents('[data-original-title]')[0] != switchTgt[0]) {
        switchTgt.trigger('click.tooltip')   
      }
    })

    //为confirm类型tooltip增加取消按钮设置默认逻辑
    $(document).on('click', '[data-dismiss=tooltip]', function(e){
      e.preventDefault()
      $(e.target).parents('.sui-tooltip').prev().trigger('click')
    })
    $(document).on('click', '[data-ok=tooltip]', function(e){
      e.preventDefault()
      var triggerEle = $(e.target).parents('.sui-tooltip').prev()
        , instance = triggerEle.data('tooltip')
        , okHideCallback = instance.options.okHide
      if (typeof okHideCallback == 'function') {
        okHideCallback.call(triggerEle)
      }
    })

  })

}(window.jQuery);
