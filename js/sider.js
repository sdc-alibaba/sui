!function ($) {

  "use strict";


 /* TAB CLASS DEFINITION
  * ==================== */



 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.sider

  $.sider = function ( element ) {
    return this.each(function () {
      var $this = $(this)
      return new Sider(element);
    })
  }

  Sider.prototype = {
    router:function(name){
      if (name ==="sider-back") {
        return this.defaults.back();
      }
      if (name ==="sider-scrollBtn") {
        return this.defaults.scroll();
      }
      if (name ==="sider-refresh") {
        return this.defaults.refresh();
      }
    }
    //,constructor = 
  }
  Sider.prototype.defaults = {
    back: function () {
      history.go(-1);
    }
    , scroll: function(){
      $('html, body').animate({scrollTop:0}, 'slow');
      $(this).removeClass("clickstatus");
    } 
    , refresh: function(){
      location.reload() ;
    }
  }

  $.sider.Constructor = Sider


 /* TAB NO CONFLICT
  * =============== */

  $.sider.noConflict = function () {
    $.sider = old
    return this
  }
  var sider = new Sider();


 /* TAB DATA-API
  * ============ */
  
  $(document).on("click",".sui-sider .btn", function (e) {
    e.preventDefault()
    sider.router($(this).attr('name'))
  })

}(window.jQuery);
