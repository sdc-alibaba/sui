!function ($) {

  "use strict";

  var CHECKED_CLASS = 'checked';
  var HALF_CHECKED_CLASS = 'halfchecked';

  var Checkbox = function (element, options) {
    this.$element = $(element)
    //this.options = $.extend({}, $.fn.checkbox.defaults, options)
    this.$checkbox = this.$element.find("input").change($.proxy(this.update, this))
    //同步状态
    this.update()
    var name = this.$checkbox.prop("name")
    var self = this;
    if (name) {
      $("input[name='"+name+"']").each(function(){
        $(this).change($.proxy(self.update, self))
      })
    }
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
  //同步状态
  Checkbox.prototype.update = function () {
    if(this.$checkbox.prop("checked")) this.$element.removeClass(HALF_CHECKED_CLASS).addClass(CHECKED_CLASS)
    else this.$element.removeClass(CHECKED_CLASS)
  }
  Checkbox.prototype.toggle = function () {
    this.$element.removeClass(HALF_CHECKED_CLASS).toggleClass(CHECKED_CLASS)
  }

  Checkbox.prototype.check = function () {
    this.$element.removeClass(HALF_CHECKED_CLASS).addClass(CHECKED_CLASS)
  }
  Checkbox.prototype.uncheck = function () {
    this.$element.removeClass(HALF_CHECKED_CLASS).removeClass(CHECKED_CLASS)
  }
  Checkbox.prototype.halfcheck = function () {
    this.$element.removeClass(CHECKED_CLASS).addClass(HALF_CHECKED_CLASS)
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


 /* DATA-API
  * =============== */

 //必须一开始就初始化，不然对于radio，由于其他相同name的radio改动的时候由于没有初始化就无法更新状态
  $(function() {
    $('[data-toggle^=checkbox],[data-toggle^=radio] ').each(function () {
      $(this).checkbox()
    })
  })

}(window.jQuery);
