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

  var Noty = function (options) {
  	var $noty = null;
    if(typeof options === typeof 'a'){
      this.options = $.extend({}, this.defaults);
      this.options.text = options;
    }else{
      this.options = $.extend({}, this.defaults, options);
    }
    return this.render();
  }

  Noty.prototype = {
    Constructor : Noty,
    render: function(){
      var options = this.options;
      var message = ".noty_message";
      var text = ".noty_text";
      var cssPrefix = "msg-";
      $(message).remove();
      this.el = $(template);
      this.el.appendTo(document.body);
      $(text).html(options.text); //this.el.find(text)
      this.el.addClass(options.position).addClass(cssPrefix+options.type);
      this.show();
    
      
      if(options.closeButton){
        this.el.addClass('show-close-btn');
      }
      if(options.closeOnSelfClick){
        this.el.click($.proxy(this.hide,this));
      }
    }
    ,hide : function(callback){  // hide : function(duration, callback);
      // this.el.fadeOut(this.options.speed,$.proxy(function(){this.el.remove();},this));
      this.el.removeClass('modal-in').addClass('modal-out');
    }
    ,show : function(duration, callback){  // show : function(duration, callback);
      // this.options.speed = duration?duration:this.options.speed;
      // var showcallback = function() {
      //   setTimeout($.proxy(this.hide,this),this.options.timeout);
      // };
      // this.el.fadeIn(this.options.speed,$.proxy(showcallback,this));
      var regcenter = new RegExp('center+');
      var classes = this.el.attr("class");
      if(regcenter.test(classes)){
        var mlwidth = -(this.el.width()/2);
        this.el.css("margin-left",mlwidth+"px");
      }
      if(this.el.hasClass('middlecenter')){
        var mtheight = -(this.el.height()/2);
        this.el.css("magin-top",mtheight);
      }
      this.el.removeClass('modal-out').addClass('modal-in');
      setTimeout($.proxy(this.hide,this),this.options.timeout);
    }
  } 

  var old = $.fn.noty
  
  $.noty = function(options){
    return new Noty(options);
  }

  Noty.prototype.defaults = {
    position: 'topcenter',
    type: 'error',
    // speed: 500,
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
