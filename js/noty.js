 /* jshint -W099 */
/* ============================================================
 * noty.js
 * 弹出框插件
 * ============================================================ */


!function ($) {
  "use strict";
 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */
  var render = function (){
    var options = this.options;
    var message = ".noty_message";
    var text = ".noty_text";
    var cssPrefix = "msg-"
    this.el = $(options.template);
    var showcallback = function() {
      setTimeout($.proxy(this.hide,this),options.timeout);
    };
    var hidecallback = function() {
      $(message).remove();
      this.el = $(options.template);
      this.el.appendTo(document.body);
      $(text).html(options.texts);
      this.show(showcallback);
    };
    if($(message).length>0){
      
      this.hide(hidecallback);
    }else{
      this.el.appendTo(document.body);
      $(text).html(options.texts);
      this.show(showcallback);
    }
    $(message).addClass(options.position).addClass(cssPrefix+options.type);
    if(options.closeButton){
      this.el.addClass('show-close-btn');
    }
    if(options.closeOnSelfClick){
      this.el.click($.proxy(this.hide,this));
    }
  }

  var Noty = function (options) {
  	var $noty = null;
  	this.options = $.extend({}, this.defaults, options);
    return render.call(this);
  }

  Noty.prototype={
    Constructor : Noty,
    hide : function(callback){
      this.el.fadeOut(this.options.speed,$.proxy(callback,this));
    }
    ,show : function(callback){
      this.el.fadeIn(this.options.speed,$.proxy(callback,this));
    }

  } 

  var old = $.fn.noty

  $.noty = function(options){
    return new Noty(options);
  }

  Noty.prototype.defaults = {
    position: 'top',
    type: 'error',
    speed: 500,
    timeout: 55000,
    closeButton: true,
    closeOnSelfClick: true,
    texts:'1111',
    template: '<div class="sui-msg msg-large noty_message"><div class="noty_text msg-con"></div><s class="msg-icon"></s><button type="button" data-dismiss="modal" aria-hidden="true" class="sui-close">×</button></div>',
  };

  $.noty.Constructor = Noty

 /* BUTTON NO CONFLICT
  * ================== */

  $.noty.noConflict = function () {
    $.noty = old
    return this
  }

 /* BUTTON DATA-API
  * =============== */ 
}(window.jQuery);

