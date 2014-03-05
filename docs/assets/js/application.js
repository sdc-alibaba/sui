// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function($) {
  "use strict";
  var parseCode = function(code) {
    return code.replace(/ {16}/g, '');  //临时修复很多空格的问题
  }
  // 侧边栏
  var $sidenav = $(".docs-sidenav").on("click", '> li', function(e) {
    var $li = $(e.currentTarget)
    if($li.hasClass(".active")) {
      return
    }
    $sidenav.find(".active").removeClass("active")
    $li.addClass("active")
  })

  //代码高亮
  $('.prettyprint').each(function() {
    var $this = $(this)
    var $target = $($this.data("target"))
    if(!$target[0]) return;
    $this.text(parseCode($target.html()))
  })
  $(function() {
    // make code pretty
    window.prettyPrint && prettyPrint()
  })

  //复制代码
  $(".copy-btn").each(function() {
    var $btn = $(this)
    var $target = $($btn.data("target"))
    var $li = $btn.parents("li")
    var $msg = $li.find(".sui-msg")
    if (!$msg[0]) {
      $msg = $('<div class="sui-msg sui-msg-success"> <div class="msg-con">代码已复制</div> <s class="msg-icon"></s> </div>').appendTo($li)
    }
    $btn.attr('data-clipboard-text', parseCode($target.html()))
    var cp = new ZeroClipboard(this, {
      moviePath: "../assets/zeroclipboard/ZeroClipboard.swf"
    })
    cp.on('load', function(cp) {
      cp.on( "complete", function(cp, args) {
        $msg.show().delay(2000).fadeOut()
      })
    })
  })
})(window.jQuery)
