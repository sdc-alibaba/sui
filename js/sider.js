!function ($) {

  "use strict";


 /* TAB CLASS DEFINITION
  * ==================== */



 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.sider

  $.sider = function(){
    return new Sider;
  }
  var Sider = function(){

  }
  Sider.prototype = {
    router :function(name){
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

  $.sider.noConflict = function () {
    $.sider = old
    return this
  }

  
  $(document).on("click",".sui-sider .btn", function (e) {
    e.preventDefault()
    $.sider().router($(e.target).attr('name'))
  })

}(window.jQuery);
