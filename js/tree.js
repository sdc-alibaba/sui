/**
 * Created by huazhi.chz on 14-4-6.
 */

!function($) {
    "use strict";

    var Tree = function(element, options) {
        this.$element = $(element);
        this.options = options;
    };

    // private methods
    // 将私有方法抽出
    var methods = {
        init : function() {
            methods.bindSelect.call(this);
            methods.bindUpdate.call(this);
            methods.getSource.call(this);
        },

        // 通过json解析dom
        _parseDom : function(list, index) {
            var dom = ['<select>'],
                placeholder = this.options.placeholder,
                val = this.options.val[index];
            placeholder && dom.push('<option vlaue="">' + placeholder + '</option>')
            list && $.each(list, function(i, n) {
                dom.push('<option data-index="' + i + '" value="' + n.id + '" ' + (n.id == val ? 'selected' : '') + '>' + n.value + '</option>');
            });
            dom = $(dom.join('')).data('nodes', list);
            return dom;
        },

        // 绑定更新事初始化事件
        bindUpdate : function() {
            var that = this;
            this.$element.on('tree:update', function() {
                var $this = $(this), dom;
                that.destroy(); // 初始化之前先移除事件并清空，防止重复出现
                dom = methods._parseDom.apply(that, [that.options.source.nodes, 0]);
                dom.appendTo($this);
//                if (that.options.val[0]) {
//                    dom.val();
//                }
                dom.trigger('change');
            });
        },

        // 绑定事件，并生成后续节点
        bindSelect : function() {
            var that = this;
            this.$element.on('change', 'select', function() {
                var $this = $(this),
                    _index = $this.find('option:selected').data('index'),
                    _curr = $this.data('nodes')[_index]; // 根据index从select上拿到相应的数据

                $this.nextAll().remove(); // 移除后面的所有select，以便重新生成
                methods.saveValue.call(that); // 保存数据
                if (_index === undefined) return; // 选择了placeholder
                // 如果isleaf = false 并且有叶结点children，拿到children数据生成后续节点
                if (!_curr.lsleaf && _curr.children.length) {
                    var dom = methods._parseDom.apply(that, [_curr.children, $this.index() + 1]);
                    dom.insertAfter($this).trigger('change');
                } else {
                    that.options.val = [];
                }
            });
        },

        // 获取数据，然后回调
        getSource : function() {
            var that = this;
            if (that.options.source) {
                // 传入数据
                callback.call(that, that.options.source);
                that.$element.trigger('tree:update');
            } else{
                // json or jsonp
                $.ajax(that.options.src, {
                    cache : false,
                    dataType : that.options.jsonp ? 'jsonp' : 'json',
                    success : function(json) {
                        that.options.source = json;
                        that.$element.trigger('tree:update');
                    }
                });
            }
        },

        // 将select的值序列化放到根结点上，以便取值 -- abrogated
        // 将值放到对象上面，只提供一个对外接口 -- modify 04.14 !not done
        saveValue : function() {
            var _val = [], _opt = [];
            this.$element.find('select').each(function() {
                _val.push(this.value);
                _opt.push($(this).find('option:selected').text());
            });
            this.datas = {option : _opt, value : _val};
        },

        // --------------------------
        // TODO 怎么把值放到一个封闭的地方，只暴露一个调用接口？

        /**
         * 取到当前的value或option
         * @param key 返回的数据类型，'value' : value数组, 'option' : option数组
         * @param isString true : 返回一个序列化后的字符串
         * @returns {string}
         */
        getValue : function(key, isString) {
            return key === 'value' ? (isString ? this.datas.value.join() : this.datas.value)
                : key === 'option' ? (isString ? this.datas.option.join() : this.datas.option)
                : this.datas;
        }
    };

    Tree.prototype = {
        constructor : Tree,

        getValue : methods.getValue,

        /**
         * 设置tree的选中值，传入的参数是一个数组
         * @param values
         */
        setValue : function(values) {
            if (!(values instanceof Array)) return;
            this.options.val = values;
            this.$element.trigger('tree:update');
        },

        destroy : function() {
            this.$element.off('change.sui.tree').empty();
        }

    };

    var old = $.fn.tree;

    $.fn.tree = function() {
        // 抽出第一个参数，作为调用的方法或初始化参数，后面的参数作为调用方法的入参
        var args = Array.prototype.slice.call(arguments),
            arg0 = args.shift(0);

        return this.each(function() {
            var $this = $(this),
                data = $this.data('tree'),
                options = $.extend({}, $.fn.tree.defaults, $this.data(), typeof arg0 === 'object' && arg0);
            if (!data) $this.data('tree', (data = new Tree(this, options))); // 只会初始化一次
            if (typeof arg0 === 'string' && typeof data[arg0] === 'function') data[arg0].apply(data, args);
            else methods.init.call(data);
        });
    };

    $.fn.tree.Constructor = Tree;

    $.fn.tree.defaults = {
        source : null, // 数据
        treeType : 'select', // 类型，下拉框或是列表
        placeholder : '请选择', // 默认的第一个选项
        val : []
    };

    // NO CONFLICT
    $.fn.tree.noConflict = function () {
        $.fn.tree = old;
        return this;
    };

    // 调用
    $(function() {
        $('[data-toggle="tree"]').tree();
    });

}(jQuery);