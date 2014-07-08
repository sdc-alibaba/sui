$(function() {
  'use strict';

  var windowHeight = $(window).height();
  var scrolltop = $(".content").scrollTop();
  var lastScrollTop = 0;
  var scrolling = false;
  var $win = $(window);

  $win.resize(function(){
    windowHeight = $win.height();
  })
  $win.scroll(scrollto);


  var scrollDisabled = false;

  var disableScroll = function() {
    if(scrollDisabled) return;
    $win.on("mousewheel.sui-disable", function(e) {
      e.preventDefault();
    });
    scrollDisabled = true;
  }
  var enableScroll = function() {
    $win.off("mousewheel.sui-disable");
    scrollDisabled = false;
  }


  function scrollto(e) {
      if(scrolling) {
        lastScrollTop = $(this).scrollTop();
        disableScroll();
        return false;
      }
      scrolling = true;
      var st = $(this).scrollTop();
      if (st > lastScrollTop){
        console.log('scroll top');
        $('body,html').animate({ scrollTop: windowHeight-59 }, 2000,function(){
          scrolling = false;
          console.log("end");
          enableScroll();
        });
      } else {
        console.log('scroll bottom');
        $('body,html').animate({ scrollTop: -(windowHeight-59) }, 2000,function(){
          scrolling = false;
          console.log("end");
          enableScroll();
        });
      }
      lastScrollTop = st;
  }
  var onScroll = function() {
    $('.jumbotron').each(function() {
      var scrollTop = $(document).scrollTop()
      var $this = $(this)
      var offsetBottom = windowHeight - ($this.offset()['top'] - scrollTop)
      if(offsetBottom > Math.min(windowHeight / 2, 300)) {
        $this.addClass('inview')
      }
    })
  }
  $(document).scroll(onScroll)
  setTimeout(onScroll, 1000)
})
