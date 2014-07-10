$(function() {
  'use strict';
    var scrolltop = $(".content").scrollTop();
    var lastScrollTop = 0;
    var scrolling = false;
    var num = 1;
    $(document).ready(function(){
      $(".main").onepage_scroll({
        sectionContainer: "section",
        responsiveFallback: 600,
        loop: true,
        afterMove: function(index) {
          if(index===2&&num===1){
            go()
          }
        }
      });
    });

    if ($(".features").length > 0) {
      var defaultOpts = { interval: 5000, fadeInTime: 300, fadeOutTime: 200 };
      var _bodies = $(".features .j-banner");
      var _count = _bodies.length;
      var _current = 0;
      var _intervalID = null;
      var stop = function () { window.clearInterval(_intervalID); };
      var slide = function (opts) {
          if (opts) {
              _current = opts.current || 0;
          } else {
              _current = (_current >= (_count - 1)) ? 0 : (++_current);
          };
          _bodies.filter(":visible").fadeOut(defaultOpts.fadeOutTime, function () {
              _bodies.eq(_current).fadeIn(defaultOpts.fadeInTime);
              _bodies.removeClass("cur").eq(_current).addClass("cur");
          });        
      };
      // var itemMouseOver = function (target, items) {
      //     stop();
      //     var i = $.inArray(target, items);
      //     slide({ current: i });
      // };
      // _bodies.hover(stop, go);
  }
 


 
  function go () {
    stop();
    _intervalID = window.setInterval(function () { slide(); }, defaultOpts.interval);
    $("[value='zoomInLeft']").parent().removeClass("disappear");
    $("[value='zoomInLeft']").addClass('animated zoomInLeft')
    setTimeout(function(){
      $("[value='rollIn']").parent().removeClass("disappear");
      $("[value='rollIn']").addClass('animated rollIn');
    },1000);
    setTimeout(function(){
      $("[value='fadeInUpBig']").parent().removeClass("disappear");
      $("[value='fadeInUpBig']").addClass('animated fadeInUpBig');
    },2000);
    setTimeout(function(){
      $("[value='rotateIn']").parent().removeClass("disappear");
      $("[value='rotateIn']").addClass('animated rotateIn');
    },3000);
    setTimeout(function(){
      $("[value='swing']").addClass('animated swing');
    },4000);
    setTimeout(function(){
      $("[value='zoomInDown']").addClass('animated zoomInDown');
      $("[value='zoomInRight']").addClass('animated zoomInRight');
      $("[value='zoomInUp']").addClass('animated zoomInUp');
    },5000)
    setTimeout(function(){
      $(".animated").removeClass();
      num = 0;
    },10000);
  };
})

