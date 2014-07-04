!function ($) {

  "use strict";


 /* TAB CLASS DEFINITION
  * ==================== */

  var Sider = function (element) {
    this.element = $(element)
  }

  Sider.prototype = {

    constructor: Sider

  , show: function () {
      var $this = this.element
       

  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.sider

  $.sider = function ( option ) {
    return this.each(function () {
      var $this = $(this)
    })
  }

  $.sider.Constructor = Sider


 /* TAB NO CONFLICT
  * =============== */

  $.sider.noConflict = function () {
    $.sider = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on("click",".sui-sider .btn", function (e) {
    e.preventDefault()
    $(this).sider('show')
  })

}(window.jQuery);
