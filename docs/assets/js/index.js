$(function() {
  'use strict';

  var windowHeight = $(window).height();
  var scrolltop = $(".content").scrollTop();
  var lastScrollTop = 0;
  var scrolling = false;

  $(window).resize(function(){
    windowHeight = $(window).height();
  })
  $(window).scroll(scrollto);


  function scrollto() {
      console.log(scrolling);
      if(scrolling) {
        lastScrollTop = $(this).scrollTop();
        return true;
      }
      scrolling = true;
      var st = $(this).scrollTop();
      if (st > lastScrollTop){
        console.log('scroll top');
        $('body,html').animate({ scrollTop: windowHeight-59 }, 200,function(){
          scrolling = false;
          console.log("end");
        });
      } else {
        console.log('scroll bottom');
        $('body,html').animate({ scrollTop: -(windowHeight-59) }, 200,function(){
          scrolling = false;
          console.log("end");
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
