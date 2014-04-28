/**
 * Created by huazhi.chz on 14-4-27.
 * tree 2.0.0
 * 由原来的一次性读取数据改为事件性获取数据
 */

!(function($) {"use strict";

    var Tree = function(element, options) {
        this.$element = $(element);
        this.options = options;
    };

    // private methods
    var methods = {
        init : function() {
            this.destory();
            methods.bindChange.call(this);
            methods.bindUpdate.call(this);
            this.$element.trigger('tree:update'); // 触发第一次更新
        },

        getData : function(id, index) {
            var that = this;
            if (!that.options.src) return;
            $.ajax(that.options.src, {
                data : that.options.key + '=' + id,
                cache : true,
                dataType : that.options.jsonp ? 'jsonp' : 'json'
            }).success(function(json) {
                if (json.code == 200 && json.data && json.data.length) {
                    methods.createDom.apply(that, [json.data, index]);
                }
            })
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
