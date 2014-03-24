/*
 * validate 核心函数，只提供框架，不提供校验规则
 */

!function($) {
  'use strict';
  var Validate = function(form, options) {
    var self = this;
    this.options = $.extend($.fn.validate.defaults, options)
    this.$form = $(form).attr("novalidate", 'novalidate');
    this.$form.submit(function() {
      return self.onsubmit();
    });
    this.$form.find('[data-rules]').each(function() {
      $(this).on('blur keyup change update', function(e) {
        var $target;
        $target = $(e.target);
        self.update.call(self, $target);
        return true;
      });
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
  Validate.prototype.onsubmit = function() {
    var hasError, self;
    self = this;
    hasError = false;
    this.$form.find("[data-rules]").each(function() {
      var $input, error;
      $input = $(this);
      error = self.update(this);
      if (error && !hasError) {
        $input.focus();
      }
      if (error) {
        return hasError = true;
      }
    });
    return !hasError;
  };
  Validate.prototype.update = function(input) {
    var $input = $(input);
    var rules = {};
    var dataRules = $input.data("rules").split('|');
    for (var i = 0; i < dataRules.length; i++) {
      var tokens = dataRules[i].split('=');
      tokens[1] = tokens[1] || '';
      rules[tokens[0]] = tokens[1];
    }
    var configRules = (this.options.rules && this.options.rules[$input.attr("name")]) || {};
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
      if (currentRule.method.call(this, inputVal, $input, value)) {
        error = false;
        hideError.call(this, $input, name);
      } else {
        error = true;
        msg = currentRule.msg;
        if ($.isFunction(msg)) msg = msg($input)
        showError.call(this, $input, name, msg.replace('$0', value));
        break;
      }
    }

    return error;
  };
  var showError = function($input, errorName, errorMsg) {
    var inputName = $input.attr("name")
    var $errors = this.errors[inputName] || (this.errors[inputName] = {});
    var $currentError = $errors[errorName]
    if (!$currentError) {
      $currentError = ($errors[errorName] = $(this.options.errorTpl.replace("$errorMsg", errorMsg)));
      this.options.placeError.call(this, $currentError, $input);
    }
    for (var k in $errors) {
      if (k !== errorName) $errors[k].hide()
    }
    $currentError.show();
    $input.addClass(this.options.inputErrorClass);
    $input.trigger("highlight");
  };
  var hideError = function($input, errorName) {
    $input.removeClass(this.options.inputErrorClass);
    var $errors = this.errors[$input.attr('name')];
    if (!$errors) return;
    $error = $errors[errorName]
    $error && $error.hide();
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
      case 'TEXTAREA':
        return $input.html()
      default:
        return $input.val()
    }
  }

  var old = $.fn.validate;
  
  $.fn.extend({
    validate: function (options) {
      return this.each(function() {
        var $this = $(this),
            data = $this.data("validate")
        if (!data) $this.data('validate', (data = new Validate(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  })
  $.fn.validate.Constructor = Validate

  $.fn.validate.defaults = {
    errorTpl: '<div class="sui-msg msg-error">\n  <div class="msg-con">\n    <span>$errorMsg</span>\n    <s class="msg-icon"></s>\n  </div>\n</div>',
    inputErrorClass: 'input-error',
    placeError: function($error, $input) {
      $input = $($input);
      var $wrap = $input.parents(".controls-wrap");
      if (!$wrap[0]) {
        $wrap = $input.parents(".controls");
      }
      $error.appendTo($wrap);
    },
    rules: undefined
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
