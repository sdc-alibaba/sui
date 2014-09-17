// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

(function($) {
  "use strict";
  var parseCode = function(code) {
    //格式化代码，删除多余缩进空格，删除多余空行
    if(!code) return;
    code = code.replace(/^ *\n/g, '').replace(/\s+$/g, '')
    var indentNum = (/^\s+/.exec(code) || ["", ""])[0] .length
    return code.replace(new RegExp(' {'+indentNum+'}', 'g'), '')
  }
  // 侧边栏
  var $sidenav = $(".docs-sidenav").on("click", '> li', function(e) {
    var $li = $(e.currentTarget)
    if($li.hasClass(".active")) {
      return
    }
    $sidenav.find(".active").removeClass("active")
    $li.addClass("active")
    changeHeight();
  })

  setTimeout(function() {
    var $globalMsg = $(".sui-layout > .sui-msg");
    if($globalMsg[0] && $globalMsg.is(":visible")) {
      $globalMsg.css({position: "static"});
      var positionSidebar = function(dirTop) {
        var $sidebar = $("body > .sui-layout > div > .sidebar"),
            scrolltop = $(window).scrollTop(),
            navbarHeight = parseInt($(document.body).css("padding-top").replace(/px/, "")),
            top = $sidebar.offset().top - scrolltop;
        if(dirTop && top <= navbarHeight) {
          $sidebar.css({position: "fixed", top: navbarHeight + "px"});
        } else if( !dirTop && scrolltop < navbarHeight) {
          $sidebar.css({position: "static"});
        }
      };
      var lastScrolltop = 0;
      $(document).on("scroll", function(e) {
        var scrolltop = $(window).scrollTop()
        positionSidebar(scrolltop > lastScrolltop);
        lastScrolltop = scrolltop;
      });
      positionSidebar();
    }
  }, 100);

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
      $msg = $('<div class="sui-msg msg-success"> <div class="msg-con">代码已复制</div> <s class="msg-icon"></s> </div>').appendTo($li)
    }
    $btn.attr('data-clipboard-text', parseCode($target.html()))
    var cp = new ZeroClipboard(this, {
      moviePath: "assets/zeroclipboard/ZeroClipboard.swf"
    })
    cp.on('load', function(cp) {
      cp.on( "complete", function(cp, args) {
        $msg.show().delay(2000).fadeOut()
      })
    })
  })

  //换肤
  var $themesInput = $("#themes-input").change(function() {
    var themes = $themesInput.val();
    var themesFile = 'sui.css';
    var themesAppendFile = 'sui-append.css';
    if(!(themes === 'default')) {
      themesFile = 'sui-themes-' + themes + ".css";
      themesAppendFile = 'sui-themes-' + themes + "-append.css";
    }
    $("#sui-css").attr('href', "../.package/css/" + themesFile);
    $("#sui-css-append").attr('href', "../.package/css/" + themesAppendFile);
    localStorage.setItem("themes-name", themes);
    $("#themes-select").find(" > a > span")[0].className = themes;
  });
})(window.jQuery)
