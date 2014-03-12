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

  Validate.addRule = (Validate.prototype.addRule = function(name, method, msg) {
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
    var $input, currentRule, error, k, msg, rule, t, tokens, v, _i, _len;
    $input = $(input);
    r = {};
    t = $input.data("rules").split('|');
    for (_i = 0, _len = t.length; _i < _len; _i++) {
      v = t[_i];
      tokens = v.split('=');
      tokens[1] = tokens[1] || '';
      r[tokens[0]] = tokens[1];
    }
    error = false;
    msg = '';
    for (k in r) {
      v = r[k];
      currentRule = Validate.rules[k];
      if (!currentRule) {
        continue;
      }
      if (currentRule.method.call(this, $input.val(), $input, v)) {
        error = false;
        this.unhighlight($input);
      } else {
        error = true;
        msg = currentRule.msg;
        this.highlight($input, msg.replace('$0', v));
        break;
      }
    }
    return error;
  };
  Validate.prototype.highlight = function($input, msg) {
    var $msg, $wrap;
    $wrap = getControl($input);
    $msg = $wrap.find(".msg-error");
    if (!$msg[0]) {
      $msg = $(this.options.errorTpl);
      $msg.appendTo($wrap);
    }
    $msg.show().find("span").empty().text(msg);
    return $input.addClass("input-error");
  };
  Validate.prototype.unhighlight = function($input) {
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
  Validate.addRule("required", required, '请填写');
  var mobile = function(value, element, param) {
    return /^0?1[3|4|5|8][0-9]\d{8,9}$/.test(trim(value));
  };
  Validate.addRule("mobile", mobile, '请填写正确的手机号码');
  var fax = function(value, element, param) {
    return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,11})+$/.test(trim(value));
  };
  Validate.addRule("fax", fax, '请填写正确的传真号码');
  var email = function(value, element, param) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(trim(value));
  };
  Validate.addRule("email", email, '请填写正确的email地址');
  var zip = function(value, element, param) {
    return /^[1-9][0-9]{5}$/.test(trim(value));
  };
  Validate.addRule("zip", zip, '请填写正确的邮编');
  var date = function(value, element, param) {
    return /^[1|2]\d{3}-[0-2][0-9]-[0-3][0-9]$/.test(trim(value));
  };
  Validate.addRule("date", date, '请填写正确的日期');
  var url = function(value, element, param) {
    var urlPattern;
    value = trim(value);
    urlPattern = /(http|ftp|https):\/\/([\w-]+\.)?[\w-]+\.(com|net|cn|org|me|io|info)/;
    if (!/^http/.test(value)) {
      value = 'http://' + value;
    }
    return urlPattern.test(value);
  };
  Validate.addRule("url", url, '请填写正确的网址');
  var mindate = function(value, element, param) {
    var input, today;
    value = trim(value);
    input = moment(trim(value));
    today = moment(moment().format('YYYY-MM-DD'));
    return input.unix() >= today.unix();
  };
  Validate.addRule("mindate", mindate, '请填写正确时间范围');
  var maxdate = function(value, element, param) {
    var input, today;
    input = moment(trim(value));
    today = moment(moment().format('YYYY-MM-DD'));
    return input.unix() <= today.unix();
  };
  Validate.addRule("maxdate", maxdate, '请填写正确时间范围');
  var minlength = function(value, element, param) {
    return trim(value).length >= param;
  };
  Validate.addRule("minlength", minlength, '长度不能少于$0');
  var maxlength = function(value, element, param) {
    return trim(value).length <= param;
  };
  Validate.addRule("maxlength", maxlength, '长度不能超过$0');
  var upload = function(value, element, param) {
    var $input;
    $input = $(element);
    return $input.val() || $input.parents(".file-upload").find("ul li")[0];
  };
  Validate.addRule("upload", upload, '请上传文件');

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
    errorTpl: '<div class="sui-msg msg-error">\n  <div class="msg-con">\n    <span></span>\n    <s class="msg-icon"></s>\n  </div>\n</div>'
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
