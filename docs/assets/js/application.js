// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function($) {

  // 侧边栏
  $sidenav = $(".docs-sidenav").on("click", '> li', function(e) {
    $li = $(e.currentTarget);
    if($li.hasClass(".active")) return
    $sidenav.find(".active").removeClass("active")
    $li.addClass("active")
  })

  //代码高亮
  $('.prettyprint').each(function() {
    $this = $(this)
    $target = $($this.data("target"))
    if(!$target[0]) return;
    $this.text($target.html().replace(/ {16}/g, ''))  //临时修复很多空格的问题
  })
  $(function() {
    // make code pretty
    window.prettyPrint && prettyPrint()
  })
})(window.jQuery)
