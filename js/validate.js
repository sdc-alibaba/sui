!function($) {
  'use strict';
  var Validate = function(form, options) {
    var self = this;
    this.options = $.extend($.fn.validate.defaults, options)
    this.$form = $(form);
    this.$form.submit(function() {
      return self.onsubmit();
    });
    return this.$form.find('[data-rules]').each(function() {
      return $(this).on('blur keyup change update', function(e) {
        var $target;
        $target = $(e.target);
        self.update.call(self, $target);
        return true;
      });
    });
  };
  Validate.rules = {};

  Validate.setRule = (Validate.prototype.setRule = function(name, method, msg) {
    return Validate.rules[name] = {
      method: method,
      msg: msg
    };
  });
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
    var r = {};
    var t = $input.data("rules").split('|');
    for (var i = 0; i < t.length; i++) {
      var v = t[i];
      var tokens = v.split('=');
      tokens[1] = tokens[1] || '';
      r[tokens[0]] = tokens[1];
    }
    var error = false;
    var msg = '';
    for (k in r) {
      var v = r[k];
      var currentRule = Validate.rules[k];
      if (!currentRule) {
        continue;
      }
      var inputVal = $input.val();
      if (!inputVal && !(currentRule == 'required')) {  //如果当前输入框没有值，并且当前不是required，则不报错
        error = false;
        this.hideError($input);
        continue
      }
      if (currentRule.method.call(this, inputVal, $input, v)) {
        error = false;
        this.hideError($input);
      } else {
        error = true;
        msg = currentRule.msg;
        this.showError($input, msg.replace('$0', v));
        break;
      }
    }

    return error;
  };
  Validate.prototype.showError = function($input, msg) {
    var $msg, $wrap;
    $wrap = getControl($input);
    $msg = $wrap.find(".msg-error");
    if (!$msg[0]) {
      $msg = $(this.options.errorTpl.replace("$errorMsg", msg));
      $msg.appendTo($wrap);
    }
    $msg.show();
    return $input.addClass("input-error");
  };
  Validate.prototype.hideError = function($input) {
    var $msg, $wrap;
    $wrap = getControl($input);
    $msg = $wrap.find(".msg-error");
    $msg.hide();
    return $input.removeClass("input-error");
  };

  // add rules
  trim = function(v) {
    return v.replace(/^\s+/g, '').replace(/\s+$/g, '');
  };
  var required = function(value, element, param) {
    return trim(value);
  };
  Validate.setRule("required", required, '请填写');
  var mobile = function(value, element, param) {
    return /^0?1[3|4|5|8][0-9]\d{8,9}$/.test(trim(value));
  };
  Validate.setRule("mobile", mobile, '请填写正确的手机号码');
  var tel = function(value, element, param) {
    return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,11})+$/.test(trim(value));
  };
  Validate.setRule("tel", tel, '请填写正确的电话号码');
  var email = function(value, element, param) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(trim(value));
  };
  Validate.setRule("email", email, '请填写正确的email地址');
  var zip = function(value, element, param) {
    return /^[1-9][0-9]{5}$/.test(trim(value));
  };
  Validate.setRule("zip", zip, '请填写正确的邮编');
  var date = function(value, element, param) {
    return /^[1|2]\d{3}-[0-2][0-9]-[0-3][0-9]$/.test(trim(value));
  };
  Validate.setRule("date", date, '请填写正确的日期');
  var url = function(value, element, param) {
    var urlPattern;
    value = trim(value);
    urlPattern = /(http|ftp|https):\/\/([\w-]+\.)?[\w-]+\.(com|net|cn|org|me|io|info)/;
    if (!/^http/.test(value)) {
      value = 'http://' + value;
    }
    return urlPattern.test(value);
  };
  Validate.setRule("url", url, '请填写正确的网址');
  var minlength = function(value, element, param) {
    return trim(value).length >= param;
  };
  Validate.setRule("minlength", minlength, '长度不能少于$0');
  var maxlength = function(value, element, param) {
    return trim(value).length <= param;
  };
  Validate.setRule("maxlength", maxlength, '长度不能超过$0');

  var getControl = function(input) {
    var $input, $wrap;
    $input = $(input);
    $wrap = $input.parents(".controls-wrap");
    if (!$wrap[0]) {
      $wrap = $input.parents(".controls");
    }
    return $wrap
  };


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
    errorTpl: '<div class="sui-msg msg-error">\n  <div class="msg-con">\n    <span>$errorMsg</span>\n    <s class="msg-icon"></s>\n  </div>\n</div>'
  };

 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.validate.noConflict = function () {
    $.fn.validate = old
    return this
  }

  //自动加载
  $(function() {
    $(".form-validate").validate()
  })
}(window.jQuery);
