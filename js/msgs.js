//msgs组件添加叉叉关闭功能
!function ($) {
  $(document).on('click.msgs', '[data-dismiss="msgs"]', function (e) {
    e.preventDefault();
    var $this = $(this),
        $msg = $this.parents('.sui-msg').remove();
    
    var id = $msg.attr("id");
    if(id && $msg.hasClass("remember")) {
      localStorage.setItem("sui-msg-" + id, 1);
    }
  })

  $(function() {
    $(".sui-msg.remember").each(function() {
      var $this = $(this);
      var id = $this.attr("id");
      if(!id) return;
      localStorage.getItem("sui-msg-" + id) || $this.show();
    });
  });
}(window.jQuery);
