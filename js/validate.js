/*
 * validate 核心函数，只提供框架，不提供校验规则
 */

!function($) {
  'use strict';
  var Validate = function(form, options) {
    var self = this;
    this.options = $.extend({}, $.fn.validate.defaults, options)
    this.$form = $(form).attr("novalidate", 'novalidate');
    this.$form.submit(function() {
      return onsubmit.call(self);
    });
    this.disabled = false;
    this.$form.on('blur keyup change update', 'input, select, textarea', function(e) {
      if(self.disabled) return;
      var $target = $(e.target);
      if ($target.attr("disabled")) return;
      update.call(self, $target);
    });
    this.errors = {};
  };
  Validate.rules = {};

  Validate.setRule = function(name, method, msg) {
    var oldRule = Validate.rules[name];
    if (oldRule && !method) {
      method = oldRule.method
    }
    Validate.rules[name] = {
      method: method,
      msg: msg
    };
  };
  Validate.setMsg = function(name, msg) {
    Validate.setRule(name, undefined, msg)
  }

  Validate.prototype = {
    disable: function() {
      this.disabled = true;
      this.hideError();
    },
    enable: function() {
      this.disabled = false;
    },
    showError: function($input, errorMsg, errorName) {
      showError.call(this, $input, errorMsg, errorName);
    },
    hideError: function($input, errorName) {
      hideError.call(this, $input, errorName);
    }
  }

  var onsubmit = function() {
    if(this.disabled) return true;
    var hasError, self;
    self = this;
    hasError = false;
    var errorInputs = [];
    this.$form.find("input, select, textarea").each(function() {
      var $input, error;
      $input = $(this);
      error = update.call(self, this);
      if (error && !hasError) {
        $input.focus();
      }
      if (error) {
        errorInputs.push($input);
        return hasError = true;
      }
    });
    if (hasError) {
      this.options.fail.call(this, errorInputs, this.$form);
    } else {
      var result = this.options.success.call(this, this.$form);
      if (result === false) {
        return false;
      }
    }
    return !hasError;
  };
  var update = function(input) {
    var $input = $(input);
    var rules = {};
    var dataRules = ($input.data("rules") || "").split('|');
    var inputName = $input.attr("name");
    for (var i = 0; i < dataRules.length; i++) {
      if (!dataRules[i]) continue;
      var tokens = dataRules[i].split('=');
      tokens[1] = tokens[1] || undefined;
      rules[tokens[0]] = tokens[1];
    }
    var configRules = (this.options.rules && this.options.rules[inputName]) || {};
    rules = $.extend(rules, configRules)
    var error = false;
    var msg = null;
    for (var name in rules) {
      var value = rules[name];

      var currentRule = Validate.rules[name];
      if (!currentRule) { //未定义的rule
        throw new Error("未定义的校验规则：" + name);
      }
      var inputVal = val($input);
      if ((!inputVal) && name !== 'required') {  //特殊处理，如果当前输入框没有值，并且当前不是required，则不报错
        error = false;
        hideError.call(this, $input);
        continue
      }
      var result = true
      // 如果规则值是一个函数，则直接用此函数的返回值
      if ($.isFunction(value)) {
        result = value.call(this, $input)
      } else {
        result = currentRule.method.call(this, inputVal, $input, value)
      }
      if (result) {
        error = false;
        hideError.call(this, $input, name);
      } else {
        error = true;
        msg = currentRule.msg;
        if ($.isFunction(msg)) msg = msg($input, value)
        //如果不是required规则，则可以使用自定义错误消息
        if(name !== 'required') {
          if($input.data("error-msg")) {
            msg = $input.data("error-msg")
          }
          if (this.options.messages && this.options.messages[inputName]) {
            msg = this.options.messages[inputName]
            if ($.isFunction(msg)) msg = msg($input, value)
            if ($.isArray(msg)) msg = msg[1]
          }
        }
        //如果是required规则
        if(name === 'required') {
          if($input.data("empty-msg")) {
            msg = $input.data("empty-msg")
          }
          if (this.options.messages && this.options.messages[inputName]) {
            var _msg = this.options.messages[inputName]
            if ($.isFunction(_msg)) _msg = msg($input, value)
            if ($.isArray(_msg)) msg = _msg[0]
          }
        }
        this.showError($input, msg.replace('$0', value), name);
        break;
      }
    }

    return error;
  };
  var showError = function($input, errorMsg, errorName) {
    errorName = errorName || "anonymous"  //匿名的，一般是手动调用showError并且没有指定一个名称时候会显示一个匿名的错误
    if (typeof $input === typeof "a") $input = this.$form.find("[name='"+$input+"']");
    $input = $($input);
    var inputName = $input.attr("name")
    var $errors = this.errors[inputName] || (this.errors[inputName] = {});
    var $currentError = $errors[errorName]
    if (!$currentError) {
      $currentError = ($errors[errorName] = $(this.options.errorTpl.replace("$errorMsg", errorMsg)));
      this.options.placeError.call(this, $input, $currentError);
    }
    for (var k in $errors) {
      if (k !== errorName) $errors[k].hide()
    }
    this.options.highlight.call(this, $input, $currentError, this.options.inputErrorClass)
    $input.trigger("highlight");
  };
  var hideError = function($input, errorName) {
    var self = this;
    var hideInputAllError = function($input) {
      var $errors = self.errors[$input.attr('name')];
      for(var k in $errors) {
        self.options.unhighlight.call(self, $input, $errors[k], self.options.inputErrorClass);
      }
    }
    if(!$input) { //没有任何参数，则隐藏所有的错误
      this.$form.find('input, select, textarea').each(function() {
        var $this = $(this);
        if ($this.attr("disabled")) return;
        hideInputAllError($this);
      });
    }
    if (typeof $input === typeof "a") $input = this.$form.find("[name='"+$input+"']");
    $input = $($input);
    var $errors = this.errors[$input.attr('name')];
    if (!$errors) return;
    if (!errorName) {
      //未指定errorName则隐藏所有ErrorMsg
      hideInputAllError($input);
      return;
    }
    var $error = $errors[errorName];
    if (!$error) return;
    this.options.unhighlight.call(this, $input, $error, this.options.inputErrorClass)
    $input.trigger("unhighlight");
  };

  //根据不同的input类型来取值
  var val = function(input) {
    var $input = $(input);
    if (!$input[0]) return undefined;
    var tagName = $input[0].tagName.toUpperCase();
    var type = ($input.attr("type") || 'text').toUpperCase()
    var name = $input.attr("name")
    var $form = $input.parents("form")
    switch(tagName) {
      case 'INPUT':
        switch(type) {
          case 'CHECKBOX':
          case 'RADIO':
            return $form.find("[name='"+name+"']:checked").val()
          default:
            return $input.val()
        }
        break;
      case 'TEXTAREA':
        return $input.val()
        break;
      default:
        return $input.val()
    }
  }

  var old = $.fn.validate;
  
  $.fn.extend({
    validate: function (options) {
      var args = arguments;
      return this.each(function() {
        var $this = $(this),
            data = $this.data("validate")
        if (!data) $this.data('validate', (data = new Validate(this, options)))
        if (typeof options == 'string') data[options].apply(data, Array.prototype.slice.call(args, 1));
      })
    }
  })
  $.fn.validate.Constructor = Validate

  $.fn.validate.defaults = {
    errorTpl: '<div class="sui-msg msg-error help-inline">\n  <div class="msg-con">\n    <span>$errorMsg</span>\n </div>   <i class="msg-icon"></i>\n  \n</div>',
    inputErrorClass: 'input-error',
    placeError: function($input, $error) {
      $input = $($input);
      var $wrap = $input.parents(".controls-wrap");
      if (!$wrap[0]) {
        $wrap = $input.parents(".controls");
      }
      if(!$wrap[0]) {
        $wrap = $input.parent();
      }
      $error.appendTo($wrap[0]);
    },
    highlight: function($input, $error, inputErrorClass) {
      $input.addClass(inputErrorClass)
      //使多控件校验规则错误框可以自动定位出错的控件位置，先将自身移动去该位置附近显示
      //对单体校验控件，因为是自身append到自身的位置，native不会有行为
      $.fn.validate.defaults.placeError($input, $error);
      $error.show()
    },
    unhighlight: function($input, $error, inputErrorClass) {
      if(!$error.is(":visible")) return;
      $input.removeClass(inputErrorClass)
      $error.hide()
    },
    rules: undefined,
    messages: undefined,
    success: $.noop,
    fail: $.noop
  };

  $.fn.validate.noConflict = function () {
    $.fn.validate = old
    return this
  }

  $.validate = Validate;

  //自动加载
  $(function() {
    $(".sui-validate").validate()
  })
}(window.jQuery);
