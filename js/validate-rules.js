// add rules
!function($) {
  Validate = $.validate;
  trim = function(v) {
    if (!v) return v;
    return v.replace(/^\s+/g, '').replace(/\s+$/g, '')
  };
  var required = function(value, element, param) {
    var $input = $(element)
    return !!trim(value);
  };
  var requiredMsg = function ($input, param) {
    var getWord = function($input) {
      var tagName = $input[0].tagName.toUpperCase();
      var type = $input[0].type.toUpperCase();
      if ( type == 'CHECKBOX' || type == 'RADIO' || tagName == 'SELECT') {
        return '选择'
      }
      return '填写'
    }
    return "请" + getWord($input)
  }
  Validate.setRule("required", required, requiredMsg);

  var prefill = function(value, element, param) {
    var $input = $(element)
    if (param && typeof param === typeof 'a') {
      var $form = $input.parents("form")
      var $required = $form.find("[name='"+param+"']")
      return !!$required.val()
    }
    return true
  }
  Validate.setRule("prefill", prefill, function($input, param) {
    var getWord = function($input) {
      var tagName = $input[0].tagName.toUpperCase();
      var type = $input[0].type.toUpperCase();
      if ( type == 'CHECKBOX' || type == 'RADIO' || tagName == 'SELECT') {
        return '选择'
      }
      return '填写'
    }
    if (param && typeof param === typeof 'a') {
      var $form = $input.parents("form")
      var $required = $form.find("[name='"+param+"']")
      if (!$required.val()) {
        return "请先" + getWord($required) + ($required.attr("title") || $required.attr("name"))
      }
    }
    return '错误'
  });
  var match = function(value, element, param) {
    value = trim(value);
    return value == $(element).parents('form').find("[name='"+param+"']").val()
  };
  Validate.setRule("match", match, '必须与$0相同');
  var number = function(value, element, param) {
    value = trim(value);
    return (/^\d+(.\d*)?$/).test(value)
  };
  Validate.setRule("number", number, '请输入数字');
  var digits = function(value, element, param) {
    value = trim(value);
    return (/^\d+$/).test(value)
  };
  Validate.setRule("digits", digits, '请输入整数');
  var mobile = function(value, element, param) {
    return (/^0?1[3|4|5|7|8][0-9]\d{8,9}$/).test(trim(value));
  };
  Validate.setRule("mobile", mobile, '请填写正确的手机号码');
  var tel = function(value, element, param) {
    return (/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,11})+$/).test(trim(value));
  };
  Validate.setRule("tel", tel, '请填写正确的电话号码');
  var email = function(value, element, param) {
    return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(trim(value)); //"
  };
  Validate.setRule("email", email, '请填写正确的email地址');
  var zip = function(value, element, param) {
    return (/^[1-9][0-9]{5}$/).test(trim(value));
  };
  Validate.setRule("zip", zip, '请填写正确的邮编');
  var date = function(value, element, param) {
    param = param || "-";
    var reg = new RegExp("^[1|2]\\d{3}"+param+"[0-2][0-9]"+param+"[0-3][0-9]$");
    return reg.test(trim(value));
  };
  Validate.setRule("date", date, '请填写正确的日期');
  var time = function(value, element, param) {
    return (/^[0-2]\d:[0-6]\d$/).test(trim(value));
  };
  Validate.setRule("time", time, '请填写正确的时间');
  var datetime = function(value, element, param) {
    var reg = new RegExp("^[1|2]\\d{3}-[0-2][0-9]-[0-3][0-9] [0-2]\\d:[0-6]\\d$");
    return reg.test(trim(value));
  };
  Validate.setRule("datetime", datetime, '请填写正确的日期和时间');
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
}(window.jQuery)
