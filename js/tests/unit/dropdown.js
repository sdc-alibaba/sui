$(function () {

    module("dropdowns")

      test("should provide no conflict", function () {
        var dropdown = $.fn.dropdown.noConflict()
        ok(!$.fn.dropdown, 'dropdown was set back to undefined (org value)')
        $.fn.dropdown = dropdown
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).dropdown, 'dropdown method is defined')
      })

      test("should return element", function () {
        var el = $("<div />")
        ok(el.dropdown()[0] === el[0], 'same element returned')
      })

      test("should not open dropdown if target is disabled", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="sui-dropdown">'
          + '<span class="dropdown-inner">'
          + '<button disabled href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>'
          + '<ul class="sui-dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</span>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(!dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
      })

      test("should not open dropdown if target is disabled", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="sui-dropdown">'
          + '<button href="#" class="btn dropdown-toggle disabled" data-toggle="dropdown">Dropdown</button>'
          + '<ul class="sui-dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(!dropdown.parent('.dropdown').hasClass('open'), 'open class added on click')
      })

      test("should add class open to menu if clicked", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="sui-dropdown">'
          + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="sui-dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(dropdown.parents('.sui-dropdown').hasClass('open'), 'open class added on click')
      })

      test("should test if element has a # before assuming it's a selector", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="sui-dropdown">'
          + '<a href="/foo/" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="sui-dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click()

        ok(dropdown.parents('.sui-dropdown').hasClass('open'), 'open class added on click')
      })


      test("should remove open class if body clicked", function () {
        var dropdownHTML = '<ul class="tabs">'
          + '<li class="sui-dropdown">'
          + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>'
          + '<ul class="sui-dropdown-menu">'
          + '<li><a href="#">Secondary link</a></li>'
          + '<li><a href="#">Something else here</a></li>'
          + '<li class="divider"></li>'
          + '<li><a href="#">Another link</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'
          , dropdown = $(dropdownHTML)
            .appendTo('#qunit-fixture')
            .find('[data-toggle="dropdown"]')
            .dropdown()
            .click()
        ok(dropdown.parents('.sui-dropdown').hasClass('open'), 'open class added on click')
        $('body').click()
        ok(!dropdown.parents('.sui-dropdown').hasClass('open'), 'open class removed')
        dropdown.remove()
      })

})
