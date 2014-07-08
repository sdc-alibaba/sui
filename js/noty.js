 /* jshint -W099 */
/* ============================================================
 * noty.js
 * 弹出框插件
 * ============================================================ */


!function ($) {
  "use strict";
 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */
  var template = '<div class="sui-msg msg-large noty_message"><div class="noty_text msg-con"></div><s class="msg-icon"></s><button type="button" data-dismiss="modal" aria-hidden="true" class="sui-close">×</button></div>';
  var render = function (){
    var options = this.options;
    var message = ".noty_message";
    var text = ".noty_text";
    var cssPrefix = "msg-"
    this.el = $(template);
    // var showcallback = function() {
    //   return;
    //   setTimeout($.proxy(this.hide,this),options.timeout);
    // };
    var hidecallback = function() {
      $(message).remove();  // this.el && this.el.remove();
      this.el = $(template);
      this.el.appendTo(document.body);
      $(text).html(options.text); //this.el.find(text);
      this.show();  //show(300)
    };
    if($(message).length>0){
      this.hide(hidecallback);  //这个callback应该拿掉，在hide中默认处理
    }else{
      this.el.appendTo(document.body);
      $(text).html(options.text); //this.el.find(text)
      this.show();
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
    if(typeof options === typeof 'a'){
      this.options = $.extend({}, this.defaults);
      this.options.text = options;
    }else{
      this.options = $.extend({}, this.defaults, options);
    }
    return render.call(this);
  }

  Noty.prototype = {
    Constructor : Noty,
    hide : function(callback){  // hide : function(duration, callback);
      this.el.fadeOut(this.options.speed,$.proxy(callback,this));
    }
    ,show : function(duration, callback){  // show : function(duration, callback);
      this.options.speed = duration?duration:this.options.speed;
      var showcallback = function() {
        setTimeout($.proxy(this.hide,this),thisoptions.timeout);
      };
      this.el.fadeIn(this.options.speed,$.proxy(showcallback,this));
      var mlwidth = -(this.el.width()/2);
      this.el.css("magin-left",mlwidth);
      if(this.el.hasClass('center')){
        var mtheight = -(this.el.height()/2);
        this.el.css("magin-top",mtheight);
      }
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
    timeout: 5000,
    closeButton: false,
    closeOnSelfClick: true,
    text:''
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
