(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#affix
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict";


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);

},{}],2:[function(require,module,exports){
/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#alerts
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict";


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

},{}],3:[function(require,module,exports){
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#buttons
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict";


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);

},{}],4:[function(require,module,exports){
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#carousel
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict";


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);

},{}],5:[function(require,module,exports){
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#collapse
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict";


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);

},{}],6:[function(require,module,exports){
/*jshint sub:true*/
/*
 * js come from :bootstrap-datepicker.js 
 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
 * you con get the source from github: https://github.com/eternicode/bootstrap-datepicker
*/
(function($, undefined){

	var $window = $(window);

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		this.dates = new DateArray();
		this.viewDate = UTCToday();
		this.focusDate = null;

		this._process_options(options);

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on, .input-group-addon, .sui-btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0)
			this.component = false;

		this.picker = $(DPGlobal.template);

		if (this.o.timepicker){
			this.timepickerContainer = this.picker.find('.timepicker-container');
			this.timepickerContainer.timepicker();
			this.timepicker = this.timepickerContainer.data('timepicker');
			this.getTimeValue();
		}

		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('tfoot th.today')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			switch (o.startView){
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode){
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
				else
					o.multidate = 1;
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = ((o.weekStart + 6) % 7);

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return (/^auto|left|right|top|bottom$/).test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return (/^left|right$/).test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return (/^top|bottom$/).test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
			if (this.isInput){ // single input
				this._events = [
					[this.element, {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.element.is('div')){  // inline datepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			//timepicker change
			if (this.o.timepicker) {
				this._events.push(
					[this.timepickerContainer,{
						'time:change': $.proxy(this.timeChange,this)
					}]
				)
			}

			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
			if (this.o.timepicker) {
				this.timepicker._attachSecondaryEvents();
			}
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
			if (this.o.timepicker) {
				this.timepicker._detachSecondaryEvents();
			}
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},
		timeChange: function(e){
			this.setValue();
		},
		show: function(e){
			if( e&&e.type === "focus" && this.picker.is( ":visible" )) return;
			if (!this.isInline)
				this.picker.appendTo('body');
			this.picker.show();
			this.place();
			this._attachSecondaryEvents();
			if(this.o.timepicker){
				this.timepicker._show();
			}
			this._trigger('show');
		},

		hide: function(){
			if (this.isInline)
				return;
			if (!this.picker.is(':visible'))
				return;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			if(this.o.timepicker){
				this.timepicker._hide();
			}
			this._trigger('hide');
		},

		remove: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			return new Date(this.dates.get(-1));
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			if (!this.isInput){
				if (this.component){
					this.element.find('input').val(formatted).change();
				}
			}
			else {
				this.element.val(formatted).change();
			}
		},

		getTimeValue: function(){
			var val ,minute,hour,time;
			time  = {
				hour: (new Date()).getHours(),
				minute: (new Date()).getMinutes()
			};
			if (this.isInput){
				element = this.element;
			}
			else if (this.component){
				element = this.element.find('input');
			}
			if (element){

				val = $.trim(element.val())
				val = val.split(':');
				for (var i = val.length - 1; i >= 0; i--) {
					val[i] = $.trim(val[i]);
				}
				if (val.length === 2) {
					minute = parseInt(val[1],10);
					if (minute >= 0 && minute < 60) {
						time.minute = minute;
					}
					hour = parseInt(val[0].splice(-2),10);
					if (hour >= 0 && hour < 24) {
						time.minute = hour;
					}
				}
			}
			this.timepickerContainer.data("time",time.hour+":"+time.minute);
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			var text = $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
			if (this.o.timepicker) {
				if (!text) {
					text = DPGlobal.formatDate(new Date(),format, lang);
				}
				text = text + " " + this.timepickerContainer.data('time');
			}
			return  text;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if (this.isInline)
				return;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				scrollTop = $window.scrollTop();

			var zIndex = parseInt(this.element.parents().filter(function(){
					return $(this).css('z-index') !== 'auto';
				}).first().css('z-index'))+10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left,
				top = offset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				// Default to left
				this.picker.addClass('datepicker-orient-left');
				if (offset.left < 0)
					left -= offset.left - visualPadding;
				else if (offset.left + calendarWidth > windowWidth)
					left = windowWidth - calendarWidth - visualPadding;
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + offset.top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height + 6;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top')) + 6;

			this.picker.css({
				top: top,
				left: left,
				zIndex: zIndex
			});
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.element.find('input').val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					date < this.o.startDate ||
					date > this.o.endDate ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length)
				this.viewDate = new Date(this.dates.get(-1));
			else if (this.viewDate < this.o.startDate)
				this.viewDate = new Date(this.o.startDate);
			else if (this.viewDate > this.o.endDate)
				this.viewDate = new Date(this.o.endDate);

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates))
					this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length)
				this._trigger('clearDate');

			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr class="week-content">';
			if (this.o.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12){
				html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1){
				cls.push('disabled');
			}
			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				tooltip;
			this.picker.find('.datepicker-days thead th.datepicker-switch')
						.text(year+'年 '+dates[this.o.language].months[month]);
			this.picker.find('tfoot th.today')
						.text(todaytxt)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot th.clear')
						.text(cleartxt)
						.toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				var currentDate;
				var today = new Date();
				if (this.o.todayHighlight &&
					prevMonth.getUTCFullYear() === today.getFullYear() &&
					prevMonth.getUTCMonth() === today.getMonth() &&
					prevMonth.getUTCDate() === today.getDate()) {
						currentDate = '今日';
				}else{
					currentDate = prevMonth.getUTCDate();
				}
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + 'data-day="'+prevMonth.getUTCDate()+'"'+'>'+ currentDate + '</td>');
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			var years = $.map(this.dates, function(d){
					return d.getUTCFullYear();
				}),
				classes;
			for (var i = -1; i < 11; i++){
				classes = ['year'];
				if (i === -1)
					classes.push('old');
				else if (i === 10)
					classes.push('new');
				if ($.inArray(year, years) !== -1)
					classes.push('active');
				if (year < startYear || year > endYear)
					classes.push('disabled');
				html += '<span class="' + classes.join(' ') + '">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
				year, month, day;
			if (target.length === 1){
				switch (target[0].nodeName.toLowerCase()){
					case 'th':
						switch (target[0].className){
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
								switch (this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1)
											this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn === 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								var element;
								if (this.isInput)
									element = this.element;
								else if (this.component)
									element = this.element.find('input');
								if (element)
									element.val("").change();
								this.update();
								this._trigger('changeDate');
								if (this.o.autoclose)
									this.hide();
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')&&!target.is('[data-num]')){
							this.viewDate.setUTCDate(1);
							if (target.is('.month')){
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1){
									this._setDate(UTCDate(year, month, day));
								}
							}
							else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2){
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							day = target.data('day');
							day = parseInt(day, 10)||1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.is('.old')){
								if (month === 0){
									month = 11;
									year -= 1;
								}
								else {
									month -= 1;
								}
							}
							else if (target.is('.new')){
								if (month === 11){
									month = 0;
									year += 1;
								}
								else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}
			else if (ix !== -1){
				this.dates.remove(ix);
			}
			else {
				this.dates.push(date);
			}
			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which  === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			this._trigger('changeDate');
			var element;
			if (this.isInput){
				element = this.element;
			}
			else if (this.component){
				element = this.element.find('input');
			}
			if (element){
				element.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveMonth: function(date, dir){
			if (!date)
				return undefined;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode === 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, newDate, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 32: // spacebar
					// Spacebar is used in manually typing dates in some formats.
					// As such, its behavior should not be hijacked.
					break;
				case 13: // enter
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					this._toggle_multidate(focusDate);
					dateChanged = true;
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				var element;
				if (this.isInput){
					element = this.element;
				}
				else if (this.component){
					element = this.element.find('input');
				}
				if (element){
					element.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker
				.find('>div')
				.hide()
				.filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName)
					.css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		$(this.inputs)
			.datepicker(options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[i]){
				// Date being moved earlier/left
				while (i >= 0 && new_date < this.dates[i]){
					this.pickers[i--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[i]){
				// Date being moved later/right
				while (i < l && new_date > this.dates[i]){
					this.pickers[i++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	$.fn.datepicker = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.is('.input-daterange') || opts.inputs){
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
				}
				else {
					$this.data('datepicker', (data = new Datepicker(this, opts)));
				}
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined)
					return false;
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	var defaults = $.fn.datepicker.defaults = {
		autoclose: true,
		beforeShowDay: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		daysOfWeekDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'yyyy-mm-dd',
		keyboardNavigation: true,
		language: 'zh-CN',
		minViewMode: 0,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: true,
		weekStart: 0,
		timepicker: false,
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		"en": {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		},
		"zh-CN": {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			today: "今日",
			weekStart: 0
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var part_re = /([\-+]\d+)([dmwy])/,
				parts = date.match(/([\-+]\d+)([dmwy])/g),
				part, dir, i;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();
			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(2000+v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m === p;
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr class="date-header">'+
							'<th class="prev"><b></b></th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next"><b></b></th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>',
		timepicerTemplate: '<div class="timepicker-container"></div>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days clearfix">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
								DPGlobal.timepicerTemplate+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-toggle="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datepicker('show');
		}
	);
	$(function(){
		$('[data-toggle="datepicker-inline"]').datepicker();
	});

}(window.jQuery));

},{}],7:[function(require,module,exports){
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#dropdowns
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict";


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        if (!$el.data("toggle")) {
          $el.attr("data-toggle", 'dropdown')
        }
        $('html').on('click.dropdown.data-api', function () {
          getContainer($el).removeClass('open')
        })
      }

    , getContainer = function($el) {
      var $parent = $el.parent()
      if ($parent.hasClass("dropdown-inner")) return $parent.parent()
      return $parent;
    }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = getContainer($this)

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

},{}],8:[function(require,module,exports){
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#modals
 * ========================================================= 
 * @file bootstrap-modal.js
 * @brief 弹层dpl，扩展自bootstrap2.3.2
 * @author banbian, zangtao.zt@alibaba-inc.com
 * @date 2014-01-14
 */

!function ($) {
  "use strict";
 /* MODAL CLASS DEFINITION
  * ====================== */
  var Modal = function (element, options) {
    this.options = options
    //若element为null，则表示为js触发的alert、confirm弹层
    if (element === null) {
      var TPL = ''
        //data-hidetype表明这类简单dialog调用hide方法时会从文档树里删除节点
        + '<div class="sui-modal hide fade" tabindex="-1" role="dialog" id={%id%} data-hidetype="remove">'
          + '<div class="modal-dialog">'
            + '<div class="modal-content">'
              + '<div class="modal-header">'
                + '<button type="button" class="sui-close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                + '<h4 class="modal-title">{%title%}</h4>'
              + '</div>'
              + '<div class="modal-body ' + (options.hasfoot ? '' : 'no-foot') + '">{%body%}</div>'
              + (options.hasfoot ? '<div class="modal-footer">'
              //增加data-ok="modal"参数
                + '<button type="button" class="sui-btn btn-primary btn-large" data-ok="modal">{%ok_btn%}</button>'
                + (options.cancelBtn ? '<button type="button" class="sui-btn btn-default btn-large" data-dismiss="modal">{%cancel_btn%}</button>' : '')
              + '</div>' : '')
            + '</div>'
          + '</div>'
        + '</div>';
      element = $(TPL.replace('{%title%}', options.title)
                      .replace('{%body%}', options.body)
                      .replace('{%id%}', options.id)
                      .replace('{%ok_btn%}', options.okBtn)
                      .replace('{%cancel_btn%}', options.cancelBtn))
      $('body').append(element)
    }
    this.$element = $(element)
    this.init()
      
  }
  //对外接口只有toggle, show, hide 
  Modal.prototype = {
    constructor: Modal
    ,init: function () {
      var ele = this.$element
        , w = this.options.width
        , self = this
        , standardW = {
            small: 440  //默认宽度
            ,normal: 590
            ,large: 790
          }
      ele.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
        .delegate(':not(.disabled)[data-ok="modal"]', 'click.ok.modal', $.proxy(this.okHide, this))
      if(w) {
        standardW[w] && (w = standardW[w])
        ele.width(w).css('margin-left', -parseInt(w) / 2)
      }
      this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
        //, function(res, status, xhr){
        //异步加载数据的情况，对话框展示时用于决定定位的信息不是最终有效信息，需要回调时校正。
        //self.resize();
    }

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
    }
      
    , show: function () {
        var that = this
          , e = $.Event('show')
          , ele = this.$element
        ele.trigger(e)
        if (this.isShown || e.isDefaultPrevented()) return
        this.isShown = true
        this.escape()
        this.backdrop(function () {
          var transition = $.support.transition && ele.hasClass('fade')
          if (!ele.parent().length) {
            ele.appendTo(document.body) //don't move modals dom position
          }
          //处理dialog在页面中的定位
          that.resize()

          ele.show()
          if (transition) {
            ele[0].offsetWidth // force reflow
          }
          ele
            .addClass('in')
            .attr('aria-hidden', false)
          that.enforceFocus()
          transition ?
            ele.one($.support.transition.end, function () { 
              callbackAfterTransition(that)
            }) :
            callbackAfterTransition(that)

          function callbackAfterTransition(that) {
            that.$element.focus().trigger('shown')
            if (that.options.timeout > 0) {
              that.timeid = setTimeout(function(){
                that.hide(); 
              }, that.options.timeout) 
            }
          }
        })
        return ele
      }

    , hide: function (e) {
        e && e.preventDefault()
        var that = this
        e = $.Event('hide')
        this.$element.trigger(e)
        if (!this.isShown || e.isDefaultPrevented()) return
        this.isShown = false
        this.escape()
        $(document).off('focusin.modal')
        that.timeid && clearTimeout(that.timeid)
        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
        return that.$element
      }
    , okHide: function(e){
        var that = this
        // 如果e为undefined而不是事件对象，则说明不是点击确定按钮触发的执行，而是手工调用，
        // 那么直接执行hideWithOk
        if (!e) {
          hideWithOk()
          return
        }
        var fn = this.options.okHide
          , ifNeedHide = true
        if (!fn) {
            var eventArr = $._data(this.$element[0], 'events').okHide
            if (eventArr && eventArr.length) {
                fn = eventArr[eventArr.length - 1].handler;
            }
        }
        typeof fn == 'function' && (ifNeedHide = fn.call(this))
        //显式返回false，则不关闭对话框
        if (ifNeedHide !== false){
          hideWithOk()
        } 
        function hideWithOk (){
          that.hideReason = 'ok'
          that.hide(e)  
        }
        return that.$element
    }
    //对话框内部遮罩层
    , shadeIn: function () {
        var $ele = this.$element
        if ($ele.find('.shade').length) return
        var $shadeEle = $('<div class="shade in" style="background:' + this.options.bgColor + '"></div>')
        $shadeEle.appendTo($ele)
        this.hasShaded = true
        return this.$element
    }
    , shadeOut: function () {
        this.$element.find('.shade').remove()
        this.hasShaded = false
        return this.$element
    }
    , shadeToggle: function () {
        return this[!this.hasShaded ? 'shadeIn' : 'shadeOut']()
    }
    // dialog展示后，如果高度动态发生变化，比如塞入异步数据后撑高容器，则调用$dialog.modal('resize'),使dialog重新定位居中
    , resize: function() {
      var ele = this.$element
        ,eleH = ele.height()
        ,winH = $(window).height()
        ,mt = 0
      if (eleH >= winH)
          mt = -winH/2
      else
          mt = (winH - eleH) / (1 + 1.618) - winH / 2
      ele.css('margin-top', parseInt(mt))
      return ele
    }
    , enforceFocus: function () {
        var that = this
        //防止多实例时循环触发
        $(document).off('focusin.modal') .on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 300)
        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
          ,ele = this.$element
        ele.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          if (that.hideReason == 'ok') {
            ele.trigger('okHidden')
            that.hideReason = null
          }
          ele.trigger('hidden')
          //销毁静态方法生成的dialog元素 , 默认只有静态方法是remove类型
          ele.data('hidetype') == 'remove' && ele.remove()
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''
          , opt = this.options
        if (this.isShown) {
          var doAnimate = $.support.transition && animate
          //如果显示背景遮罩层
          if (opt.backdrop !== false) {
            this.$backdrop = $('<div class="sui-modal-backdrop ' + animate + '" style="background:' + opt.bgColor + '"/>')
            .appendTo(document.body)         
            //遮罩层背景黑色半透明
            this.$backdrop.click(
              opt.backdrop == 'static' ?
                $.proxy(this.$element[0].focus, this.$element[0])
              : $.proxy(this.hide, this)
            )
            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
            this.$backdrop.addClass('in ')
            if (!callback) return
            doAnimate ?
              this.$backdrop.one($.support.transition.end, callback) :
              callback()
          } else {
            callback && callback()
          }
        } else {
          if (this.$backdrop) {
            this.$backdrop.removeClass('in')
            $.support.transition && this.$element.hasClass('fade')?
              this.$backdrop.one($.support.transition.end, callback) :
              callback()
          } else {
            callback && callback();
          }
        }
      }
  }

 /* MODAL PLUGIN DEFINITION
  * ======================= */


  var old = $.fn.modal

  $.fn.modal = function (option) {
    //this指向dialog元素Dom，
    //each让诸如 $('#qqq, #eee').modal(options) 的用法可行。
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      //这里判断的目的是：第一次show时实例化dialog，之后的show则用缓存在data-modal里的对象。
      if (!data) $this.data('modal', (data = new Modal(this, options)))

      //如果是$('#xx').modal('toggle'),务必保证传入的字符串是Modal类原型链里已存在的方法。否则会报错has no method。
      if (typeof option == 'string') data[option]()
      else data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , bgColor: '#000'
    , keyboard: true
    , hasfoot: true
  }

  $.fn.modal.Constructor = Modal
 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }

 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      //$target这里指dialog本体Dom(若存在)
      //通过data-target="#foo"或href="#foo"指向
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $this.data())
    e.preventDefault()
    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
    })
  })

  /* jquery弹层静态方法，用于很少重复，不需记住状态的弹层，可方便的直接调用，最简单形式就是$.alert('我是alert')
   * 若弹层内容是复杂的Dom结构， 建议将弹层html结构写到模版里，用$(xx).modal(options) 调用
   * 
   * example
   * $.alert({
   *  title: '自定义标题'
   *  body: 'html' //必填
   *  okBtn : '好的'
   *  cancelBtn : '雅达'
   *  bgColor : '#123456'  背景遮罩层颜色
   *  width: {number|string(px)|'small'|'normal'|'large'}推荐优先使用后三个描述性字符串，统一样式
   *  timeout: {number} 1000    单位毫秒ms ,dialog打开后多久自动关闭
   *  hasfoot: {Boolean}  是否显示脚部  默认true
   *  show:     fn --------------function(e){}
   *  shown:    fn
   *  hide:     fn
   *  hidden:   fn
   *  okHide:   function(e){alert('点击确认后、dialog消失前的逻辑,
   *            函数返回true（默认）则dialog关闭，反之不关闭;若不传入则默认是直接返回true的函数
   *            注意不要人肉返回undefined！！')}
   *  okHidden: function(e){alert('点击确认后、dialog消失后的逻辑')}
   * })
   *
   */
  $.extend({
    _modal: function(dialogCfg, customCfg){
      var modalId = +new Date()
        
        ,finalCfg = $.extend({}, $.fn.modal.defaults
          , dialogCfg
          , {id: modalId, okBtn: '确定'}
          , (typeof customCfg == 'string' ? {body: customCfg} : customCfg))
      var dialog = new Modal(null, finalCfg)
        , $ele = dialog.$element 
      _bind(modalId, finalCfg)
      $ele.data('modal', dialog).modal('show')
      function _bind(id, eList){
        var eType = ['show', 'shown', 'hide', 'hidden', 'okHidden']
        $.each(eType, function(k, v){
          if (typeof eList[v] == 'function'){
            $(document).on(v, '#'+id, $.proxy(eList[v], $('#' + id)[0]))
          }
        })
      }
      //静态方法对话框返回对话框元素的jQuery对象
      return $ele
    }
    //为最常见的alert，confirm建立$.modal的快捷方式，
    ,alert: function(customCfg){
      var dialogCfg = {
        type: 'alert'
        ,title: '注意'
      }
      return $._modal(dialogCfg, customCfg)
    }
    ,confirm: function(customCfg){
      var dialogCfg = {
        type: 'confirm'
        ,title: '提示'
        ,cancelBtn: '取消'
      }
      return $._modal(dialogCfg, customCfg)
    }
  })

}(window.jQuery);

},{}],9:[function(require,module,exports){
(function ($) {
    function Pagination(opts) {
        this.itemsCount = opts.itemsCount;
        this.pageSize = opts.pageSize;
        this.displayPage = opts.displayPage < 5 ? 5 : opts.displayPage;
        this.pages = Math.ceil(opts.itemsCount / opts.pageSize);
        $.isNumeric(opts.pages) && (this.pages = opts.pages);
        this.currentPage = opts.currentPage;
        this.styleClass = opts.styleClass;
        this.onSelect = opts.onSelect;
        this.showCtrl = opts.showCtrl;
        this.remote = opts.remote;
    }

    /* jshint ignore:start */
    Pagination.prototype = {
        //generate the outer wrapper with the config of custom style
        _draw: function () {
            var tpl = '<div class="sui-pagination';
            for (var i = 0; i < this.styleClass.length; i++) {
                tpl += ' ' + this.styleClass[i];
            }
            tpl += '"></div>'
            this.hookNode.html(tpl);
            this._drawInner();
        },
        //generate the true pagination
        _drawInner: function () {
            var outer = this.hookNode.children('.sui-pagination');
            var tpl = '<ul>' + '<li class="prev' + (this.currentPage - 1 <= 0 ? ' disabled' : ' ') + '"><a href="#" data="' + (this.currentPage - 1) + '">«上一页</a></li>';
            if (this.pages <= this.displayPage || this.pages == this.displayPage + 1) {
                for (var i = 1; i < this.pages + 1; i++) {
                    i == this.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                }

            } else {
                if (this.currentPage < this.displayPage - 1) {
                    for (var i = 1; i < this.displayPage; i++) {
                        i == this.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                    }
                    tpl += '<li class="dotted"><span>...</span></li>';
                    tpl += '<li><a href="#" data="' + this.pages + '">' + this.pages + '</a></li>';
                } else if (this.currentPage > this.pages - this.displayPage + 2 && this.currentPage <= this.pages) {
                    tpl += '<li><a href="#" data="1">1</a></li>';
                    tpl += '<li class="dotted"><span>...</span></li>';
                    for (var i = this.pages - this.displayPage + 2; i <= this.pages; i++) {
                        i == this.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                    }
                } else {
                    tpl += '<li><a href="#" data="1">1</a></li>';
                    tpl += '<li class="dotted"><span>...</span></li>';
                    var frontPage,
                        backPage,
                        middle = (this.displayPage - 3) / 2;
                    if ( (this.displayPage - 3) % 2 == 0 ) {
                        frontPage = backPage = middle; 
                    } else {
                        frontPage = Math.floor(middle);
                        backPage = Math.ceil(middle);
                    }
                    for (var i = this.currentPage - frontPage; i <= this.currentPage + backPage; i++) {
                        i == this.currentPage ? (tpl += '<li class="active"><a href="#" data="' + i + '">' + i + '</a></li>') : (tpl += '<li><a href="#" data="' + i + '">' + i + '</a></li>');
                    }
                    tpl += '<li class="dotted"><span>...</span></li>';
                    tpl += '<li><a href="#" data="' + this.pages + '">' + this.pages + '</a></li>';
                }
            }
            tpl += '<li class="next' + (this.currentPage + 1 > this.pages ? ' disabled' : ' ') + '"><a href="#" data="' + (this.currentPage + 1) + '">下一页»</a></li>' + '</ul>';
            this.showCtrl && (tpl += this._drawCtrl());
            outer.html(tpl);
        },
        //值传递
        _drawCtrl: function () {
            var tpl = '<div>&nbsp;' + '<span>共' + this.pages + '页</span>&nbsp;' + '<span>' + '&nbsp;到&nbsp;' + '<input type="text" class="page-num"/><button class="page-confirm">确定</button>' + '&nbsp;页' + '</span>' + '</div>';
            return tpl;
        },

        _ctrl: function () {
            var self = this,
                pag = self.hookNode.children('.sui-pagination');

            function doPagination() {
                var tmpNum = parseInt(pag.find('.page-num').val());
                if ($.isNumeric(tmpNum) && tmpNum <= self.pages && tmpNum > 0) {
                    if (!self.remote) {
                        self.currentPage = tmpNum;
                        self._drawInner();
                    }
                    if ($.isFunction(self.onSelect)) {
                        self.onSelect.call($(this), tmpNum);
                    }
                }
            }
            pag.on('click', '.page-confirm', function (e) {
                doPagination.call(this)
            })
            pag.on('keypress', '.page-num', function (e) {
                e.which == 13 && doPagination.call(this)
            })
        },

        _select: function () {
            var self = this;
            self.hookNode.children('.sui-pagination').on('click', 'a', function (e) {
                e.preventDefault();
                var tmpNum = parseInt($(this).attr('data'));
                if (!$(this).parent().hasClass('disabled') && !$(this).parent().hasClass('active')) {
                    if (!self.remote) {
                        self.currentPage = tmpNum;
                        self._drawInner();
                    }
                    if ($.isFunction(self.onSelect)) {
                        self.onSelect.call($(this), tmpNum);
                    }
                }
            })
        },

        init: function (opts, hookNode) {
            this.hookNode = hookNode;
            this._draw();
            this._select();
            this.showCtrl && this._ctrl();
            return this;
        },

        updateItemsCount: function (itemsCount, pageToGo) {
            $.isNumeric(itemsCount) && (this.pages = Math.ceil(itemsCount / this.pageSize));
            //如果最后一页没有数据了，返回到剩余最大页数
            this.currentPage = this.currentPage > this.pages ? this.pages : this.currentPage;
            $.isNumeric(pageToGo) && (this.currentPage = pageToGo);
            this._drawInner();
        },

        updatePages: function (pages, pageToGo) {
            $.isNumeric(pages) && (this.pages = pages);
            this.currentPage = this.currentPage > this.pages ? this.pages : this.currentPage;
            $.isNumeric(pageToGo) && (this.currentPage = pageToGo);
            this._drawInner();
        },

        goToPage: function (page) {
            if ($.isNumeric(page) && page <= this.pages && page > 0) {
                this.currentPage = page;
                this._drawInner()
            }
        }
    }
    /* jshint ignore:end */

    var old = $.fn.pagination;
    
    $.fn.pagination = function (options) {
        var opts = $.extend({}, $.fn.pagination.defaults, typeof options == 'object' && options);
        if (typeof options == 'string') {
            args = $.makeArray(arguments);
            args.shift();
        }
        var $this = $(this),
        pag = $this.data('sui-pagination');
        if (!pag) $this.data('sui-pagination', (pag = new Pagination(opts).init(opts, $(this))))
            else if (typeof options == 'string') {
                pag[options].apply(pag, args)
            }
        return pag;
    };

    $.fn.pagination.Constructor = Pagination;

    $.fn.pagination.noConflict = function () {
        $.fn.pagination = old;
        return this
    }

    $.fn.pagination.defaults = {
        pageSize: 10,
        displayPage: 5,
        currentPage: 1,
        itemsCount: 100,
        styleClass: [],
        pages: null,
        showCtrl: false,
        onSelect: null,
        remote: false
    }

})(window.jQuery)

},{}],10:[function(require,module,exports){
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#popovers
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict";


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

},{}],11:[function(require,module,exports){
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#scrollspy
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict";


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

},{}],12:[function(require,module,exports){
//核心组件
require('./transition')
require('./alert')
require('./button')
require('./carousel')
require('./collapse')
require('./dropdown')
require('./modal')
require('./tooltip')
require('./popover')
require('./scrollspy')
require('./tab')
require('./affix')
require('./pagination')
require('./validate')
require('./validate-rules')
require('./tree')
require('./datepicker')
require('./timepicker')
},{"./affix":1,"./alert":2,"./button":3,"./carousel":4,"./collapse":5,"./datepicker":6,"./dropdown":7,"./modal":8,"./pagination":9,"./popover":10,"./scrollspy":11,"./tab":13,"./timepicker":14,"./tooltip":15,"./transition":16,"./tree":17,"./validate":19,"./validate-rules":18}],13:[function(require,module,exports){
/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tabs
 * ========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict";


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

},{}],14:[function(require,module,exports){
!function ($) {
function TimePicker(element, cfg){
	if(!(this instanceof TimePicker)){
		return new TimePicker(element, cfg);
	}

	this.init(element, cfg);
}

TimePicker.prototype = {

	_defaultCfg: {
		hour: (new Date()).getHours(),
		minute: (new Date()).getMinutes(),
		orientation: {x: 'auto', y: 'auto'},
		keyboardNavigation: true
	},

	init: function(element, cfg){

		this.element  = $(element)
		this.isInline = false;
		this.isInDatepicker = false;
		this.isInput = this.element.is('input');
		
		this.component = this.element.is('.date') ? this.element.find('.add-on, .input-group-addon, .sui-btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0)
			this.component = false;


		this.picker = $('<div class="timepicker"></div>');


		this.o = this.config = $.extend(this._defaultCfg, cfg);

		this._buildEvents();
		this._attachEvents();

		if(this.isInDatepicker){
			this.picker.addClass('timepicker-in-datepicker').appendTo(this.element);
		}else if (this.isInline){
			this.picker.addClass('timepicker-inline').appendTo(this.element);
			this._show();
		}else{
			this.picker.addClass('timepicker-dropdown dropdown-menu');
		}
	},

	destory: function(){
		this._detachSecondaryEvents();
		this.picker.html('');
		this.picker = null;
	},

	_show: function(){
		if (!this.isInline&&!this.isInDatepicker)
				this.picker.appendTo('body');
		this.picker.show();
		this._place();
		this._render();
		this._attachSecondaryEvents();
	},

	_hide: function(){
		if (this.isInline || this.isInDatepicker)
			return;
		if (!this.picker.is(':visible'))
			return;
		this.focusDate = null;
		this.picker.hide().detach();
		this._detachSecondaryEvents();
	},

	_keydown: function(e){
		if (this.isInDatepicker) return;
		if (this.picker.is(':not(:visible)')){
			if (e.keyCode === 27) // allow escape to hide and re-show picker
				this._show();
			return;
		}
		var dir,rol;
		switch (e.keyCode){
			case 27: // escape
				this._hide();
				e.preventDefault();
				break;
			case 37: // left
			case 39: // right
				if (!this.o.keyboardNavigation)
					break;
				dir = e.keyCode === 37 ? 'up' : 'down';
				rol = 'hour';
				this._slide(rol,dir);
				break;
			case 38: // up
			case 40: // down
				if (!this.o.keyboardNavigation)
					break;
				dir = e.keyCode === 38 ? 'up' : 'down';
				rol = 'minute';
				this._slide(rol,dir);
				break;
			case 32: // spacebar
				// Spacebar is used in manually typing dates in some formats.
				// As such, its behavior should not be hijacked.
				break;
			case 13: // enter
				this._hide();
				break;
		}
	},

	_place:function(){
		if (this.isInline || this.isInDatepicker)
				return;
		var calendarWidth = this.picker.outerWidth(),
			calendarHeight = this.picker.outerHeight(),
			visualPadding = 10,
			$window = $(window),
			windowWidth = $window.width(),
			windowHeight = $window.height(),
			scrollTop = $window.scrollTop();

			var zIndex = parseInt(this.element.parents().filter(function(){
					return $(this).css('z-index') !== 'auto';
				}).first().css('z-index'))+10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left,
				top = offset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				// Default to left
				this.picker.addClass('datepicker-orient-left');
				if (offset.left < 0)
					left -= offset.left - visualPadding;
				else if (offset.left + calendarWidth > windowWidth)
					left = windowWidth - calendarWidth - visualPadding;
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + offset.top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height + 6;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top')) + 6;

			this.picker.css({
				top: top,
				left: left,
				zIndex: zIndex
			});
	},

	// envent method
	_events: [],
	_secondaryEvents: [],
	_applyEvents: function(evs){
		for (var i=0, el, ch, ev; i < evs.length; i++){
			el = evs[i][0];
			if (evs[i].length === 2){
				ch = undefined;
				ev = evs[i][1];
			}
			else if (evs[i].length === 3){
				ch = evs[i][1];
				ev = evs[i][2];
			}
			el.on(ev, ch);
		}
	},
	_unapplyEvents: function(evs){
		for (var i=0, el, ev, ch; i < evs.length; i++){
			el = evs[i][0];
			if (evs[i].length === 2){
				ch = undefined;
				ev = evs[i][1];
			}
			else if (evs[i].length === 3){
				ch = evs[i][1];
				ev = evs[i][2];
			}
			el.off(ev, ch);
		}
	},

	_attachEvents: function(){
		this._detachEvents();
		this._applyEvents(this._events);
	},
	_detachEvents: function(){
		this._unapplyEvents(this._events);
	},
	_attachSecondaryEvents: function(){
		this._detachSecondaryEvents();
		this._applyEvents(this._secondaryEvents);
		this._pickerEvents();
	},
	_detachSecondaryEvents: function(){
		this._unapplyEvents(this._secondaryEvents);
		this.picker.off('click');
	},

	_buildEvents:function(){
		if (this.isInput){ // single input
			this._events = [
				[this.element, {
					focus: $.proxy(this._show, this),
					keyup: $.proxy(function(e){
						if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
							this._hide();
					}, this),
					keydown: $.proxy(this._keydown, this)
				}]
			];
		}
		else if (this.component && this.hasInput){ // component: input + button
			this._events = [
				// For components that are not readonly, allow keyboard nav
				[this.element.find('input'), {
					focus: $.proxy(this._show, this),
					keyup: $.proxy(function(e){
						if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
							this._hide();
					}, this),
					keydown: $.proxy(this._keydown, this)
				}],
				[this.component, {
					click: $.proxy(this._show, this)
				}]
			];
		}
		else if (this.element.is('div')){  // inline timepicker
			if (this.element.is('.timepicker-container')) {
				this.isInDatepicker = true;
			} else{
				this.isInline = true;
			}
		}
		else {
			this._events = [
				[this.element, {
					click: $.proxy(this._show, this)
				}]
			];
		}
		this._events.push(
			// Component: listen for blur on element descendants
			[this.element, '*', {
				blur: $.proxy(function(e){
					this._focused_from = e.target;
				}, this)
			}],
			// Input: listen for blur on element
			[this.element, {
				blur: $.proxy(function(e){
					this._focused_from = e.target;
				}, this)
			}]
		);

		this._secondaryEvents = [
			[$(window), {
				resize: $.proxy(this._place, this)
			}],
			[$(document), {
				'mousedown touchstart': $.proxy(function(e){
					// Clicked outside the datepicker, hide it
					if (!(
						this.element.is(e.target) ||
						this.element.find(e.target).length ||
						this.picker.is(e.target) ||
						this.picker.find(e.target).length
					)){
						this._hide();
					}
				}, this)
			}]
		];
	},

	_pickerEvents: function(){

		var self = this;

		this.picker.on('click', '.J_up', function(ev){

			var target = ev.currentTarget,
				parentNode = $(target).parent(),
				role = parentNode.attr('data-role');

			self._slide(role, 'up');

		}).on( 'click', '.J_down',function(ev){
			var target = ev.currentTarget,
				parentNode = $(target).parent(),
				role = parentNode.attr('data-role');

			self._slide(role, 'down');

		}).on( 'click', 'span',function(ev){

			var target = ev.currentTarget,
				parentNode = $(target).parent().parent().parent(),
				role = parentNode.attr('data-role'),
				targetNum = target.innerHTML,
				attrs = self[role + 'Attr'],
				step = parseInt(targetNum - attrs.current,10),
				dur;
			if(step > 0){
				self._slideDonw(attrs, step);
			}else{
				self._slideUp(attrs, -step);
			}

		});
	},

	_slide: function(role, direction){

		var attrs = this[role+ 'Attr'];

		if(direction == 'up'){
			this._slideUp(attrs);	
		}else if(direction == 'down'){
			this._slideDonw(attrs);
		}
	},

	_slideDonw: function(attrs, step){

		step = step || 1;
		var cp = attrs.cp,
			dur = attrs.ih*step;

		attrs.current += step;

		if(attrs.current > attrs.maxSize){
			attrs.current = 0;
			dur = -attrs.ih * attrs.maxSize;
		}

		attrs.cp -= dur;
		this._animate(attrs.innerPickerCon, attrs.cp);

		$('.current', attrs.innerPickerCon).removeClass('current');
		$('span[data-num="' + attrs.current + '"]', attrs.innerPickerCon).addClass('current');

		this._setValue();
	},

	_slideUp: function(attrs, step){

		step = step || 1;

		var cp = attrs.cp,
			dur = attrs.ih*step;

		attrs.current -= step;

		if(attrs.current < 0){
			attrs.current = attrs.maxSize;
			dur = -attrs.ih * attrs.maxSize;
		}

		attrs.cp += dur;
		this._animate(attrs.innerPickerCon, attrs.cp);
		$('.current', attrs.innerPickerCon).removeClass('current');
		$('span[data-num="' + attrs.current + '"]', attrs.innerPickerCon).addClass('current');
		
		this._setValue();
	},

	_update: function(){
		var oldMimute = this.o.minute;
		var oldHour = this.o.hour,
			attrs,role,step;

		this._getInputDate();
		if (oldMimute !== this.o.minute) {
			attrs = this['minuteAttr'];
			step = parseInt(this.o.minute - attrs.current,10);
		}
		if (oldHour !== this.o.hour) {
			attrs = this['hourAttr'];
			step = parseInt(this.o.hour - attrs.current,10);
		}
		if(step&&(step > 0)){
			this._slideDonw(attrs, step);
		}else if(step){
			this._slideUp(attrs, -step);
		}else{ //use for format
			this._setValue();
		}
	},

	_render: function(){
		this.picker.html('');
		this._getInputDate();
		this._renderHour();
		this._renderMinutes();
		this._renderSplit();
		//form input
		this._setValue();
	},

	_getInputDate: function(){
		if (this.isInline&&this.isInDatepicker) return;
		var element,minute,hour,val;
		if (this.isInput||this.isInDatepicker){
			element = this.element;
		}
		else if (this.component){
			element = this.element.find('input');
		}
		if (element){
			if(this.isInDatepicker){
				val = $.trim(element.data('time'));
			}else{
				val = $.trim(element.val());
			}
			val = val.split(':');
			for (var i = val.length - 1; i >= 0; i--) {
				val[i] = $.trim(val[i]);
			}
			if (val.length === 2) {
				minute = parseInt(val[1],10);
				if (minute >= 0 && minute < 60) {
					this.o.minute = minute;
				}
				hour = parseInt(val[0],10);
				if (hour >= 0 && hour < 24) {
					this.o.hour = hour;
				}
			}
		}
	},

	_juicer: function(current,list){
		var items = '',item;
		for (var i = list.length - 1; i >= 0; i--) {
			if (list[i] == current) {
				item = '<span ' + 'class="current" data-num="' + i + '">' + list[i] + '</span>';
			} else{
				item = '<span ' + 'data-num="' + i + '">' + list[i] + '</span>';
			}
			items = item + items;
		}
		return '<div class="picker-wrap">' +
					'<a href="javascript:;" class="picker-btn up J_up"><b class="arrow"></b><b class="arrow-bg"></b></a>' +
						'<div class="picker-con">'+
							'<div class="picker-innercon">'+
								items +
							'</div>' +
						'</div>' +
						'<a href="javascript:;" class="picker-btn down J_down"><b class="arrow"></b><b class="arrow-bg"></b></a>' +
					'</div>';
	},

	_renderHour: function(){
		var self = this,
			hourRet = [];

		for(var i = 0; i < 24; i++){
			hourRet.push(self._beautifyNum(i));
		}

		var tpl = this._juicer(self.o.hour,hourRet),
			$tpl = $(tpl);

		$tpl.attr('data-role', 'hour');

		this.picker.append($tpl);

		this.hourAttr = this._addPrefixAndSuffix($tpl, 23);
		this.hourAttr.current = this.o.hour;
		this.hourAttr.maxSize = 23;
	},

	_renderMinutes: function(){
		var self = this,
			minuteRet = [];
		for(var i = 0; i < 60; i++){
			minuteRet.push(self._beautifyNum(i));
		}

		var tpl = this._juicer(self.o.minute, minuteRet),
			$tpl = $(tpl);

		$tpl.attr('data-role', 'minute');

		this.picker.append($tpl);

		this.minuteAttr = this._addPrefixAndSuffix($tpl, 59);
		this.minuteAttr.current = this.o.minute;
		this.minuteAttr.maxSize = 59;
	},

	_addPrefixAndSuffix: function(parentNode, maxSize){

		var self = this,
			pickerCon = $('.picker-con', parentNode),
			innerPickerCon = $('.picker-innercon', parentNode),
			currentNode = $('.current', parentNode),
			itemH = currentNode.outerHeight(),
			parentH = pickerCon.outerHeight(),
			fixNum = Math.floor(parentH/itemH) + 1,
			currentNodeOffsetTop,
			currentPosition,
			tpl = '';

		for(var i = maxSize - fixNum; i <= maxSize; i++){
			tpl += '<span>' + self._beautifyNum(i) + '</span>';
		}

		innerPickerCon.prepend($(tpl));

		tpl = '';

		for(var i = 0; i < fixNum; i ++){
			tpl += '<span>' + self._beautifyNum(i) + '</span>';
		}

		innerPickerCon.append($(tpl));

		currentNodeOffsetTop = currentNode.offset().top - pickerCon.offset().top;
		currentPosition =  -currentNodeOffsetTop + itemH * 2;
		this._animate(innerPickerCon, currentPosition);

		return {
			ph: parentH,
			cp: currentPosition,
			ih: itemH,
			innerPickerCon: innerPickerCon,
			scrollNum: fixNum - 1
		};
	},

	_renderSplit: function(){
		var tpl = '<div class="timePicker-split">' +
						'<div class="hour-input"></div>' +
						'<div class="split-icon">:</div>' +
						'<div class="minute-input"></div>' +
					'</div>';

		this.picker.append($(tpl));
	},

	_setValue: function(){
		if (this.isInline) return;
		var element,text,
			 minute,hour;
		hour = this.hourAttr.current;
		minute =  this.minuteAttr.current;
		text = this._beautifyNum(hour)+' : '+ this._beautifyNum(minute);

		if (this.isInput){
			element = this.element;
		}
		else if (this.component){
			element = this.element.find('input');
		}
		if (element){
			element.change();
			element.val(text);
		}else if(this.isInDatepicker){
			this.element.data("time",text);
			this.element.trigger('time:change');
		}
	},

	_animate: function(node, dur){

		if ($.support.transition) {
			node.css({
				'top': dur + 'px',
			});
		}else{
			node.animate({
				top: dur + 'px',
			},300);
		}
		
	},

	_beautifyNum: function(num){
		num = num.toString();
		if(parseInt(num) < 10){
			return '0' + num;
		}

		return num;
	}
}

/* DROPDOWN PLUGIN DEFINITION
   * ========================== */
//maincode end
var old = $.fn.timepicker;
$.fn.timepicker = function(option){
	var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
	this.each(function(){
		var $this = $(this)
        , data = $this.data('timepicker')
		if (!data) $this.data('timepicker', (data = new TimePicker(this,option)))
		if (typeof option === 'string' && typeof data[option] === 'function'){
			internal_return = data[option].apply(data, args);
			if (internal_return !== undefined)
				return false;
		}
	});
	if (internal_return !== undefined)
		return internal_return;
	else
		return this;
}
/* TIMEPICKER NO CONFLICT
	* =================== */

$.fn.timepicker.noConflict = function(){
	$.fn.timepicker = old;
	return this;
};


/* TIMEPICKER DATA-API
* ================== */

$(document).on(
	'focus.timepicker.data-api click.timepicker.data-api',
	'[data-toggle="timepicker"]',
	function(e){
		var $this = $(this);
		if ($this.data('timepicker'))
			return;
		e.preventDefault();
		// component click requires us to explicitly show it
		$this.timepicker('_show');
	}
);
$(function(){
	$('[data-toggle="timepicker-inline"]').timepicker();
});
}(window.jQuery)
},{}],15:[function(require,module,exports){
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict";


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  //element为触发元素，如标识文字链
  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))

        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      //为confirm类型tooltip增加取消按钮设置默认逻辑
      if (this.options.type == 'confirm') {
        this.$element.parent().on('click', '[data-dismiss=tooltip]', function(e){
          $(this).parents('.sui-tooltip').prev().trigger('click')
        })
        this.$element.parent().on('click', '[data-ok=tooltip]', $.proxy(this.options.okHide, this))

      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      var foot = options.type == 'confirm' ? '<div class="tooltip-footer"><button class="sui-btn btn-primary" data-ok="tooltip">确定</button><button class="sui-btn btn-default" data-dismiss="tooltip">取消</button></div>' : ''
      //根据tooltip的type类型构造tip模版
      options.template = '<div class="sui-tooltip ' + options.type + ' break-line" style="overflow:visible"><div class="tooltip-arrow"><div class="tooltip-arrow cover"></div></div><div class="tooltip-inner"></div>' + foot + '</div>'
      options.type == 'confirm' && (options.html = true)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      self.hoverState = 'in'
      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      this.timeout = setTimeout(function() {
        //isHover 为0或undefined，undefined:没有移到tip上过
        if (!self.isTipHover) {
          self.hoverState = 'out'
        }
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')
        , opt = this.options
        , widthLimit = opt.widthlimit
        , self = this

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (opt.animation) {
          $tip.addClass('fade')
        }

        placement = typeof opt.placement == 'function' ?
          opt.placement.call(this, $tip[0], this.$element[0]) :
          opt.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        opt.container ? $tip.appendTo(opt.container) : $tip.insertAfter(this.$element)

        if (opt.trigger !== 'click') {
          $tip.hover(function(){
            self.isTipHover = 1;
          }, function(){
            self.isTipHover = 0;
            self.hide()
          })
        }

        //宽度限制逻辑
        if (widthLimit !== true) {
          var val
          widthLimit === false && (val = 'none')
          typeof opt.widthlimit == 'string' && (val = widthLimit)
          $tip.css('max-width', val)
        }
        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        //+ - 7修正，和css对应，勿单独修改
        var d = opt.type == 'attention' ? 5 : 7
        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height + d, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight - d, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - d}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + d}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()
      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)
      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {

    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , type: 'normal'   //tip 类型 {string} 'normal'|'attention'|'confirm' ,区别见demo
  , placement: 'top'
  , selector: false  //通常要配合调用方法使用，如果tooltip元素很多，用此途径进行事件委托减少事件监听数量: $('body').tooltip({selector: '.tips'})
  , trigger: 'hover focus'   //触发方式，多选：click hover focus，如果希望手动触发，则传入'manual'
  , title: 'it is default title'  //默认tooltip的内容，如果给html元素添加了title属性则使用该html属性替代此属性
  , delay: {show:0, hide: 200}   //如果只传number，则show、hide时都会使用这个延时，若想差异化则传入形如{show:400, hide: 600} 的对象   注：delay参数对manual触发方式的tooltip无效
  , html: true  //决定是html()还是text()
  , container: false  //将tooltip与输入框组一同使用时，为了避免不必要的影响，需要设置container.他用来将tooltip的dom节点插入到container指定的元素内的最后，可理解为 container.append(tooltipDom)。
  , widthlimit: true  // {Boolean|string} tooltip元素最大宽度限制，false不限宽，true限宽300px，也可传入"500px",人工限制宽度
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

  //document ready init
  $(function(){
    $('[data-toggle="tooltip"]').tooltip()

    //点击外部可消失tooltip
    $(document).on('mousedown', function(e){
      var tgt = $(e.target)
        , tip = $('.sui-tooltip')
        , switchTgt = tip.prev()
        , tipContainer = tgt.parents('.sui-tooltip')
      if (tip.length && !tipContainer.length && tgt[0] != switchTgt[0]) {
        switchTgt.trigger('click.tooltip')   
      }
    })

  })

}(window.jQuery);

},{}],16:[function(require,module,exports){
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#transitions
 * ===================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict";


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);

},{}],17:[function(require,module,exports){
/**
 * Created by huazhi.chz on 14-4-27.
 * tree 2.0.0
 * 由原来的一次性读取数据改为事件性获取数据
 */

!(function($) {"use strict";

    var Tree = function(element, options) {
        this.$element = $(element);
        this.options = options;
        this.redis = new Redis();
    };

    // 数据缓存处理
    var Redis = function() {
        this.data = {};
    }

    Redis.prototype = {
        constructor : Redis,

        query : function(key) {
            return this.data[key];
        },

        insert : function(key, value) {
            this.data[key] = value;
        },

        clear : function() {
            this.data = {};
        }
    }

    // private methods
    var methods = {
        init : function() {
            this.destory();
            methods.bindChange.call(this);
            methods.bindUpdate.call(this);
            this.$element.trigger('tree:update'); // 触发第一次更新
        },

        getData : function(id, index) {
            var that = this, data = that.redis.query(id); // 先获取缓存数据
            if (!that.options.src) return;
            // 先取缓存数据
            if (data) {
                methods.createDom.apply(that, [data, index])
            } else { // 如果没有就重新获取
                $.ajax(that.options.src, {
                    data : that.options.key + '=' + id,
                    cache : true,
                    dataType : that.options.jsonp ? 'jsonp' : 'json'
                }).success(function(json) {
                    if (json.code == 200 && json.data && json.data.length) {
                        data = json.data;
                        that.redis.insert(id, data); // 将值存放缓存中
                        methods.createDom.apply(that, [data, index]);
                    }
                })
            }
        },

        createDom : function(list, index) {
            var dom = ['<select>'],
                placeholder = this.options.placeholder,
                val = this.options.val[index];
            placeholder && dom.push('<option value="">' + placeholder + '</option>');
            $.each(list, function(i, n) {
                dom.push('<option data-isleaf="' + n.isleaf + '" value="' + n.id + '" ' + (n.id == val ? 'selected' : '') + '>' + n.value + '</option>')
            });
            dom.push('</select>');
            //return dom.join('');
            dom = $(dom.join('')).appendTo(this.$element).trigger('change');
        },

        bindChange : function() {
            var that = this;
            this.$element.on('change.sui.tree', 'select', function(e) {
                var $this = $(this), v = $this.val();
                $this.nextAll().remove();
                methods.saveValue.call(that);
                if (!v) return; // 选择了placeholder
                if (!$this.find('option:selected').data('isleaf')) methods.getData.apply(that, [v, $this.index() + 1]);
                else that.options.val = []; // 清空初始化的时候设置的值
            })
        },

        bindUpdate : function() {
            var that = this;
            this.$element.on('tree:update', function(e) {
                var $this = $(this);
                $this.empty();
                methods.getData.apply(that, [0, 0]); // 每次重新获取数据的id都为0
            })
        },

        saveValue : function() {
            var _val = [], _opt = [];
            this.$element.find('select').each(function() {
                _val.push(this.value);
                _opt.push($(this).find('option:selected').text());
            });
            this.datas = {option : _opt, value : _val};
        }
    };

    Tree.prototype = {
        constructor : Tree,

        getValue : $.noop, // how ?

        setValue : function(ary) {
            this.options.val = ary;
            this.$element.trigger('tree:update');
        },

        destory : function() {
            this.$element.off('change.sui.tree').empty();
        }
    };

    var old = $.fn.tree;

    $.fn.extend({
        tree : function() {
            var args = Array.prototype.slice.call(arguments),
                arg0 = args.shift();

            return this.each(function() {
                var $this = $(this),
                    data = $this.data('tree'),
                    options = $.extend({}, $.fn.tree.defaults, $this.data(), typeof arg0 === 'object' && arg0);
                if (!data) $this.data('tree', (data = new Tree(this, options))); // 在每个元素上只保存一个实例
                if (typeof arg0 === 'string' && typeof data[arg0] === 'function') data[arg0].apply(data, args);
                else methods.init.call(data);
            });
        }
    });

    $.fn.tree.Constructor = Tree;

    $.fn.tree.defaults = {
        src : '', // 数据源，json或jsonp
        treeType : 'select', // TODO tree的类型，select或list
        placeholder : '请选择',
        val : [], // update时取的值
        key : 'id' // 默认的参数名
    };

    // NO CONFLICT
    $.fn.tree.noConflict = function () {
        $.fn.tree = old;
        return this;
    };

    // auto handle
    $(function() {
        $('[data-toggle="tree"]').tree();
    });

})(jQuery);

},{}],18:[function(require,module,exports){
// add rules
!function($) {
  Validate = $.validate;
  trim = function(v) {
    if (!v) return v;
    return v.replace(/^\s+/g, '').replace(/\s+$/g, '')
  };
  var required = function(value, element, param) {
    var $input = $(element)
    return !!trim(value);
  };
  var requiredMsg = function ($input, param) {
    var getWord = function($input) {
      var tagName = $input[0].tagName.toUpperCase();
      var type = $input[0].type.toUpperCase();
      if ( type == 'CHECKBOX' || type == 'RADIO' || tagName == 'SELECT') {
        return '选择'
      }
      return '填写'
    }
    return "请" + getWord($input)
  }
  Validate.setRule("required", required, requiredMsg);

  var prefill = function(value, element, param) {
    var $input = $(element)
    if (param && typeof param === typeof 'a') {
      var $form = $input.parents("form")
      var $required = $form.find("[name='"+param+"']")
      return !!$required.val()
    }
    return true
  }
  Validate.setRule("prefill", prefill, function($input, param) {
    var getWord = function($input) {
      var tagName = $input[0].tagName.toUpperCase();
      var type = $input[0].type.toUpperCase();
      if ( type == 'CHECKBOX' || type == 'RADIO' || tagName == 'SELECT') {
        return '选择'
      }
      return '填写'
    }
    if (param && typeof param === typeof 'a') {
      var $form = $input.parents("form")
      var $required = $form.find("[name='"+param+"']")
      if (!$required.val()) {
        return "请先" + getWord($required) + ($required.attr("title") || $required.attr("name"))
      }
    }
    return '错误'
  });
  var match = function(value, element, param) {
    value = trim(value);
    return value == $(element).parents('form').find("[name='"+param+"']").val()
  };
  Validate.setRule("match", match, '必须与$0相同');
  var number = function(value, element, param) {
    value = trim(value);
    return (/^\d+(.\d*)?$/).test(value)
  };
  Validate.setRule("number", number, '请输入数字');
  var digits = function(value, element, param) {
    value = trim(value);
    return (/^\d+$/).test(value)
  };
  Validate.setRule("digits", digits, '请输入整数');
  var mobile = function(value, element, param) {
    return (/^0?1[3|4|5|7|8][0-9]\d{8,9}$/).test(trim(value));
  };
  Validate.setRule("mobile", mobile, '请填写正确的手机号码');
  var tel = function(value, element, param) {
    return (/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,11})+$/).test(trim(value));
  };
  Validate.setRule("tel", tel, '请填写正确的电话号码');
  var email = function(value, element, param) {
    return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(trim(value)); //"
  };
  Validate.setRule("email", email, '请填写正确的email地址');
  var zip = function(value, element, param) {
    return (/^[1-9][0-9]{5}$/).test(trim(value));
  };
  Validate.setRule("zip", zip, '请填写正确的邮编');
  var date = function(value, element, param) {
    return (/^[1|2]\d{3}-[0-2][0-9]-[0-3][0-9]$/).test(trim(value));
  };
  Validate.setRule("date", date, '请填写正确的日期');
  var url = function(value, element, param) {
    var urlPattern;
    value = trim(value);
    urlPattern = /(http|ftp|https):\/\/([\w-]+\.)?[\w-]+\.(com|net|cn|org|me|io|info)/;
    if (!/^http/.test(value)) {
      value = 'http://' + value;
    }
    return urlPattern.test(value);
  };
  Validate.setRule("url", url, '请填写正确的网址');
  var minlength = function(value, element, param) {
    return trim(value).length >= param;
  };
  Validate.setRule("minlength", minlength, '长度不能少于$0');
  var maxlength = function(value, element, param) {
    return trim(value).length <= param;
  };
  Validate.setRule("maxlength", maxlength, '长度不能超过$0');
}(window.jQuery)

},{}],19:[function(require,module,exports){
/*
 * validate 核心函数，只提供框架，不提供校验规则
 */

!function($) {
  'use strict';
  var Validate = function(form, options) {
    var self = this;
    this.options = $.extend($.fn.validate.defaults, options)
    this.$form = $(form).attr("novalidate", 'novalidate');
    this.$form.submit(function() {
      return onsubmit.call(self);
    });
    this.$form.find('input, select, textarea').each(function() {
      var $this = $(this);
      if ($this.attr("disabled")) return;
      $this.on('blur keyup change update', function(e) {
        var $target;
        $target = $(e.target);
        update.call(self, $target);
        return true;
      });
    });
    this.errors = {};
  };
  Validate.rules = {};

  Validate.setRule = function(name, method, msg) {
    var oldRule = Validate.rules[name];
    if (oldRule && !method) {
      method = oldRule.method
    }
    Validate.rules[name] = {
      method: method,
      msg: msg
    };
  };
  Validate.setMsg = function(name, msg) {
    Validate.setRule(name, undefined, msg)
  }

  var onsubmit = function() {
    var hasError, self;
    self = this;
    hasError = false;
    this.$form.find("input, select, textarea").each(function() {
      var $input, error;
      $input = $(this);
      error = update.call(self, this);
      if (error && !hasError) {
        $input.focus();
      }
      if (error) {
        return hasError = true;
      }
    });
    return !hasError;
  };
  var update = function(input) {
    var $input = $(input);
    var rules = {};
    var dataRules = ($input.data("rules") || "").split('|');
    for (var i = 0; i < dataRules.length; i++) {
      if (!dataRules[i]) continue;
      var tokens = dataRules[i].split('=');
      tokens[1] = tokens[1] || undefined;
      rules[tokens[0]] = tokens[1];
    }
    var configRules = (this.options.rules && this.options.rules[$input.attr("name")]) || {};
    rules = $.extend(rules, configRules)
    var error = false;
    var msg = null;
    for (var name in rules) {
      var value = rules[name];

      var currentRule = Validate.rules[name];
      if (!currentRule) { //未定义的rule
        throw new Error("未定义的校验规则：" + name);
      }
      var inputVal = val($input);
      if ((!inputVal) && name !== 'required') {  //特殊处理，如果当前输入框没有值，并且当前不是required，则不报错
        error = false;
        hideError.call(this, $input);
        continue
      }
      var result = true
      // 如果规则值是一个函数，则直接用此函数的返回值
      if ($.isFunction(value)) {
        result = value.call(this, $input)
      } else {
        result = currentRule.method.call(this, inputVal, $input, value)
      }
      if (result) {
        error = false;
        hideError.call(this, $input, name);
      } else {
        error = true;
        msg = currentRule.msg;
        if ($.isFunction(msg)) msg = msg($input, value)
        showError.call(this, $input, name, msg.replace('$0', value));
        break;
      }
    }

    return error;
  };
  var showError = function($input, errorName, errorMsg) {
    var inputName = $input.attr("name")
    var $errors = this.errors[inputName] || (this.errors[inputName] = {});
    var $currentError = $errors[errorName]
    if (!$currentError) {
      $currentError = ($errors[errorName] = $(this.options.errorTpl.replace("$errorMsg", errorMsg)));
      this.options.placeError.call(this, $input, $currentError);
    }
    for (var k in $errors) {
      if (k !== errorName) $errors[k].hide()
    }
    this.options.highlight.call(this, $input, $currentError, this.options.inputErrorClass)
    $input.trigger("highlight");
  };
  var hideError = function($input, errorName) {
    var $errors = this.errors[$input.attr('name')];
    if (!$errors) return;
    var $error = $errors[errorName];
    if (!$error) return;
    this.options.unhighlight.call(this, $input, $error, this.options.inputErrorClass)
    $input.trigger("unhighlight");
  };

  //根据不同的input类型来取值
  var val = function(input) {
    var $input = $(input);
    if (!$input[0]) return undefined;
    var tagName = $input[0].tagName.toUpperCase();
    var type = ($input.attr("type") || 'text').toUpperCase()
    var name = $input.attr("name")
    var $form = $input.parents("form")
    switch(tagName) {
      case 'INPUT':
        switch(type) {
          case 'CHECKBOX':
          case 'RADIO':
            return $form.find("[name='"+name+"']:checked").val()
          default:
            return $input.val()
        }
        break;
      case 'TEXTAREA':
        return $input.html()
        break;
      default:
        return $input.val()
    }
  }

  var old = $.fn.validate;
  
  $.fn.extend({
    validate: function (options) {
      return this.each(function() {
        var $this = $(this),
            data = $this.data("validate")
        if (!data) $this.data('validate', (data = new Validate(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  })
  $.fn.validate.Constructor = Validate

  $.fn.validate.defaults = {
    errorTpl: '<div class="sui-msg msg-error">\n  <div class="msg-con">\n    <span>$errorMsg</span>\n    <s class="msg-icon"></s>\n  </div>\n</div>',
    inputErrorClass: 'input-error',
    placeError: function($input, $error) {
      $input = $($input);
      var $wrap = $input.parents(".controls-wrap");
      if (!$wrap[0]) {
        $wrap = $input.parents(".controls");
      }
      $error.appendTo($wrap);
    },
    highlight: function($input, $error, inputErrorClass) {
      $input.addClass(inputErrorClass)
      $error.show()
    },
    unhighlight: function($input, $error, inputErrorClass) {
      $input.removeClass(inputErrorClass)
      $error.hide()
    },
    rules: undefined
  };

  $.fn.validate.noConflict = function () {
    $.fn.validate = old
    return this
  }

  $.validate = Validate;

  //自动加载
  $(function() {
    $(".sui-validate").validate()
  })
}(window.jQuery);

},{}]},{},[12]);