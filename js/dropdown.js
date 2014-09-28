//proxy dropdown to document, so there is no need to init
!function ($) {

  "use strict";
  var toggleSelector = '[data-toggle=dropdown]',
      containerClass = ".sui-dropdown, .sui-dropup";
  var clearMenus = function () {
    $('.sui-dropdown.open, .sui-dropup.open, .sui-btn-group.open').each(function () {
      $(this).removeClass('open')
    })
  }
  var getContainer = function($el) {
    var $parent = $el.parent()
    if ($parent.hasClass("dropdown-inner")) return $parent.parent()
    return $parent;
  }
  var show = function() {
    clearMenus()
    var $el = $(this),
        $container = getContainer($el);
    if ($container.is('.disabled, :disabled')) return
    $container.addClass("open")
    $el.focus()
    return false;
  }
  var hide = function() {
    var $el = $(this),
        $container = getContainer($el);
    if ($container.is('.disabled, :disabled')) return
    $container.removeClass("open")
    $el.focus()
    return false;
  }

  var toggle = function() {
    var $el = $(this),
        $container = getContainer($el),
        active = $container.hasClass("open");
    clearMenus()
    if ($container.is('.disabled, :disabled')) return
    if(active) $container.removeClass("open")
    else $container.addClass("open")
    $el.focus()
    return false;
  }

  var setValue = function() {
    var $target = $(this),
        $li = $target.parent(),
        $container = $target.parents(".sui-dropdown, .sui-dropup"),
        $menu = $container.find("[role='menu']");
    if($li.is(".disabled, :disabled")) return;
    if ($container.is('.disabled, :disabled')) return;
    $container.find("input").val($target.attr("value") || "").trigger("change")
    $container.find(toggleSelector+ ' span').html($target.html())
    $menu.find(".active").removeClass("active")
    $li.addClass("active")
  }


  $(document).on("mouseover", containerClass, function() {
    var $container = $(this), el;
    if(el = $container.find('[data-trigger="hover"]')[0]) show.call(el);
  })
  $(document).on("mouseleave", containerClass, function() {
    var $container = $(this), el;
    if(el = $container.find('[data-trigger="hover"]')[0]) hide.call(el);
  })
  $(document).on("click", "[data-toggle='dropdown']", toggle)
  $(document).on("click", function() {
    var $this = $(this);
    if(!($this.is(containerClass) || $this.parents(containerClass)[0])) clearMenus()
  })

  $(document).on("click", ".select .sui-dropdown-menu a", setValue)


  // Dropdown api
  $.fn.dropdown = function(option) {
    return this.each(function() {
      $(this).attr("data-toggle", "dropdown");
      if(typeof option == 'string') {
        switch(option) {
          case "show":
            show.call(this);
            break;
          case "hide":
            hide.call(this);
            break;
          case "toggle":
            toggle.call(this);
            break;
        }
      }
    });
  }

}(window.jQuery);
