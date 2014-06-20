!function ($) {

  "use strict";

  var CHECKED_CLASS = 'checked';
  var HALF_CHECKED_CLASS = 'halfchecked';
  var DISABLED_CLASS= 'disabled';

  var Checkbox = function (element, options) {
    this.$element = $(element)
    //this.options = $.extend({}, $.fn.checkbox.defaults, options)
    this.$checkbox = this.$element.find("input")
  }

  var old = $.fn.checkbox

  $.fn.checkbox = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('checkbox')
        , options = typeof option == 'object' && option
      if (!data) $this.data('checkbox', (data = new Checkbox(this, options)))
      else if (option) data[option]()
    })
  }
  
  Checkbox.prototype.toggle = function () {
    if(this.$checkbox.prop("checked")) this.uncheck()
    else this.check()
    this.$checkbox.trigger("change")
  }

  Checkbox.prototype.check = function () {
    if(this.$checkbox.prop("disabled")) return
    this.$checkbox.prop('checked', true)
    this.$checkbox.trigger("change")
  }
  Checkbox.prototype.uncheck = function () {
    if(this.$checkbox.prop("disabled")) return
    this.$checkbox.prop('checked', false)
    this.$checkbox.trigger("change")
  }
  Checkbox.prototype.halfcheck = function () {
    if(this.$checkbox.prop("disabled")) return
    this.$checkbox.prop('checked', false)
    this.$element.removeClass(CHECKED_CLASS).addClass("halfchecked")
  }

  Checkbox.prototype.disable = function () {
    this.$checkbox.prop('disabled', true)
    this.$checkbox.trigger("change")
  }
  Checkbox.prototype.enable = function () {
    this.$checkbox.prop('disabled', false)
    this.$checkbox.trigger("change")
  }

  $.fn.checkbox.defaults = {
    loadingText: 'loading...'
  }

  $.fn.checkbox.Constructor = Checkbox


 /* NO CONFLICT
  * ================== */

  $.fn.checkbox.noConflict = function () {
    $.fn.checkbox = old
    return this
  }

  $.fn.radio = $.fn.checkbox;


  // update status on document;
  $(document).on("change", "input[type='checkbox'], input[type='radio']", function(e) {
    var $checkbox= $(e.currentTarget);
    var $container = $checkbox.parent();
    var update = function($checkbox) {
      var $container = $checkbox.parent();
      if($checkbox.prop("checked")) $container.removeClass(HALF_CHECKED_CLASS).addClass(CHECKED_CLASS)
      else $container.removeClass(CHECKED_CLASS).removeClass(HALF_CHECKED_CLASS)
      if($checkbox.prop('disabled')) $container.addClass(DISABLED_CLASS)
      else $container.removeClass(DISABLED_CLASS)
    }
    if($container.hasClass("checkbox-pretty") || $container.hasClass("radio-pretty")) {
      update($checkbox);
    }
    if($checkbox.attr('type').toLowerCase() === 'radio') {
      var name = $checkbox.attr("name");
      $("input[name='"+name+"']").each(function() {
        update($(this));
      });
    }
  });
}(window.jQuery);
