$(function() {
  'use strict';
  var windowHeight = $(window).height()

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
