$(function() {
  'use strict';

  var windowHeight = $(window).height();
  var scrolltop = $(".content").scrollTop();
  var lastScrollTop = 0;
  $(window).resize(function(){
    windowHeight = $(window).height();
    $(window).scroll(scrollto);
  })
  $(window).scroll(scrollto);

  function scrollto() {
    var st = $(this).scrollTop();
     if (st > lastScrollTop){
        $('body,html').animate({ scrollTop: windowHeight-59 }, 800);
        // $(window).scrollTop(windowHeight-59);
     } else {
        $('body,html').animate({ scrollTop: -windowHeight-59 }, 800);
        // $(window).scrollTop(-windowHeight-59);
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
