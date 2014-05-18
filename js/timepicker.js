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