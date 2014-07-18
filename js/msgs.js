//msgs组件添加叉叉关闭功能
!function ($) {
  $(document).on('click.msgs', '[data-dismiss="msgs"]', function (e) {
    e.preventDefault()
    $(this).parents('.sui-msg').remove();
  })
}(window.jQuery);
