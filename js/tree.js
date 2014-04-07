/**
 * Created by huazhi.chz on 14-4-6.
 * 级联选择
 */

!function($) {
    "use strict";

    var SuiTree = function(element, options) {
        this.$element = $(element);
        this.options = options;
    };

    SuiTree.prototype = {
        constructor : SuiTree,

        destroy : function() {

        },

        init : function() {
            this._getSource(this._createSelect);
        },

        // 生成第一个select
        _createSelect : function(source) {
            var $this = this.$element,
                dom = ['<select>'];
            this.options.placeholder && dom.push('<option value="">' + this.options.placeholder + '</option>');
            source.nodes && $.each(source.nodes, function(i, n) {
                dom.push('<option data-index="' + i + '" value="' + n.id + '">' + n.value + '</option>');
            });
            dom = $(dom.join('')).data('nodes', source.nodes);
            $this.append(dom);
            this._bindSelect();
        },

        // 绑定事件，并生成后续节点
        _bindSelect : function() {
            var that = this;
            this.$element.on('change', 'select', function() {
                var $this = $(this),
                    _index = $this.find('option:selected').data('index'),
                    _curr = $this.data('nodes')[_index]; // 根据index从父select上拿到相应的数据
                $this.nextAll().remove(); // 移除后面的所有select，以便重新生成
                that._setValue();
                if (_index === undefined) return; // 选择了placeholder
                // 如果isleaf = false 并且有叶结点children，拿到children数据生成后续节点
                if (!_curr.lsleaf && _curr.children.length) {
                    var dom = ['<select>'];
                    that.options.placeholder && dom.push('<option value="">' + that.options.placeholder + '</option>');
                    $.each(_curr.children, function(i, n) {
                        dom.push('<option data-index="' + i + '" value="' + n.id + '">' + n.value + '</option>');
                    });
                    dom = $(dom.join('')).data('nodes', _curr.children);
                    $this.after(dom)
                }
            });
        },

        // 将select的值序列化放到根结点上，以便取值
        _setValue : function() {
            var _val = [], _opt = [];
            this.$element.find('select').each(function() {
                _val.push(this.value);
                _opt.push($(this).find('option:selected').text());
            });
            this.$element.data('value', _val);
            this.$element.data('value', _opt);
        },

        // 获取数据，然后回调
        _getSource : function(fn) {
            var that = this;
            if (that.options.source) {
                // 传入数据
                fn.call(that,that.options.source);
            } else if (that.options.src) {
                // json
                $.ajax(that.options.src, {
                    cache : false,
                    dataType : 'json',
                    success : function(json) {
                        that.options.source = json;
                        fn.call(that, json);
                    }
                });
            } else if (that.options.jsonp) {
                // jsonp
                $.ajax(that.options.jsonp, {
                    cache : false,
                    dataType : 'jsonp',
                    jsonpCallback : that.options.jsonpCallback,
                    success : function(json) {
                        that.options.source = json;
                        fn.call(that,json);
                    }
                });
            }
        }

    };

    var old = $.fn.suitree;

    $.fn.suitree = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('suitree'),
                options = $.extend({}, $.fn.suitree.defaults, $this.data(), typeof option === 'object' && option),
                methods = ["destroy"];
            if (!data) $this.data('suitree', (data = new SuiTree(this, options)));
            if (typeof option == 'string' && $.inArray(option, methods) >= 0) data[option].call(data);
            else data.init.call(data);
        });
    };

    $.fn.suitree.Constructor = SuiTree;

    $.fn.suitree.defaults = {
        source : null, // 数据
        jsonpCallback : "callbackSuiTree", // 默认的jsonp回调方法，如果是jsonp请求
        treeType : 'select', // 类型，下拉框或是列表
        placeholder : '请选择' // 默认的第一个选项
    };

    // NO CONFLICT
    $.fn.suitree.noConflict = function () {
        $.fn.suitree = old;
        return this;
    };

    // 调用
    $(function() {
        $('[data-toggle="tree"]').suitree();
    });

}(jQuery);
