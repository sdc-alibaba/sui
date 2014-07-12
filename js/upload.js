/* jshint ignore:start */
(function($) {
  // 注册一个ajax prefilter,创建新的type类型upload，检测ajax方法调用的入参有没有upload
  $.ajaxPrefilter(function(options, origOptions, jqXHR) {
    if (options.upload) {
      options.originalURL = options.url;
      return 'upload';
    }
  });

  // 为dataType为upload的请求类型注册一个 ajax transport
  // 但他只在ajax方法调用时传入不为空的file属性才会激活.file属性是一个file input类数组
  $.ajaxTransport('upload', function(options, origOptions, jqXHR) {
    var form = null,
      iframe = null,
      name = 'upload-' + (+new Date()),
      files = $(options.files).filter(':file:enabled'),
      markers = null,
      accepts = null;

    // 成功提交隐藏iframe内的file input后或者放弃提交后执行，使所有页面上的变化恢复原状。
    function cleanUp() {
      files.each(function(k, v) {
        var $file = $(v);
        $file.data('clone').replaceWith($file);
      });
      form.remove();
      iframe.one("load", function() { iframe.remove(); });
      iframe.attr("src", "javascript:false");
    }

    // 从jquery ajax 的dataTypes队列中弹出第一个值，使之后数据的处理类型基于服务器返回的数据类型
    options.dataTypes.shift();

    // 获取需要额外传输的数据
    var extraData = (options.data = origOptions.data);

    if (files.length) {
      form = $('<form enctype="multipart/form-data" method="post"></form>').hide().attr({action: options.originalURL, target: name});

      // 提交文件同时如果需要额外传输一些数据，直接放在ajax调用的data参数里
      // 但因为是附加为iframe表单的隐藏域里传值，数据不能被序列化为string。processData属性设为false即可。
      if (typeof(extraData) === 'string' && extraData.length > 0) {
        throw Error('额外传输的数据不应该被序列化（serialized）');
      }
      $.each(extraData || {}, function(k, v) {
        if ($.isPlainObject(v)) {
          k = v.name;
          v = v.value;
        }
        $('<input type="hidden"/>').attr({name:  k, value: v}).appendTo(form);
      });

      $('<input type="hidden" name="X-Requested-With" value="IFrame"/>').appendTo(form);
      if (options.dataTypes[0] && options.accepts[options.dataTypes[0]]) {
        accepts = options.accepts[options.dataTypes[0]] +
                  (options.dataTypes[0] !== "*" ? ", */*; q=0.01" : "");
      } else {
        accepts = options.accepts["*"];
      }
      $('<input type="hidden" name="X-HTTP-Accept">').attr('value', accepts).appendTo(form);

      markers = files.after(function(idx) {
        var $this = $(this),
          $clone = $this.clone().prop('disabled', true);
        $this.data('clone', $clone);
        return $clone;
      }).next();
      files.appendTo(form);

      return {
        // $.ajax()内部通过send方法发具体请求。自定义一个
        send: function(headers, completeCallback) {
          iframe = $('<iframe src="javascript:false" name="' + name + '" id="' + name + '" style="display:none"></iframe>');

          // iframe被注入到DOM后触发第一个load事件，已准备提交文件
          iframe.one('load', function() {
            // 第二个load在收到服务器响应表单提交后。
            iframe.one("load", function() {
              var doc = this.contentWindow ? this.contentWindow.document :
                (this.contentDocument ? this.contentDocument : this.document),
                root = doc.documentElement ? doc.documentElement : doc.body,
                textarea = root.getElementsByTagName("textarea")[0],
                type = textarea && textarea.getAttribute("data-type") || null,
                status = textarea && textarea.getAttribute("data-status") || 200,
                statusText = textarea && textarea.getAttribute("data-statusText") || "OK",
                content = {
                  html: root.innerHTML,
                  text: type ?
                    textarea.value :
                    root ? (root.textContent || root.innerText) : null
                };
              cleanUp();
              completeCallback(status, statusText, content, type ?
                ('Content-Type: ' + type) :
                null);
            });

            form[0].submit();
          });

          $('body').append(form, iframe);
        },

        abort: function() {
          if (iframe !== null) {
            iframe.unbind('load').attr('src', 'javascript:false');
            cleanUp();
          }
        }
      };
    }
  });
  //提取上传参数
  function getParam (fileinput) {
    var data = opt.data
      , param = {
        type: 'post',
        dataType: 'json',
        files: fileinput,
        upload: true
      };
    (typeof opt.data == 'function') && (data = data())
    if (data) {
      $.extend(param, {
        data: data,
        processData: false
      })
    }     
    return param;
  }
  // 文件大小限制
  // max {numer} 单位KB
  // min {numer} 单位KB
  // this为file input
  function checkSize (max, min) {
    var size = this.files[0].size
      ,ret = {isok:true, errMsg: ''};
    if (typeof max == 'number' && size > max) {
      ret.isok = false; 
      ret.errMsg = '文件大小请不要超过' + $;
    }
    if (typeof min == 'number' && size < min) {
      ret.isok = false; 
      ret.errMsg = '文件大小请不要小于' + $;
    }
    return ret;
  }

  /*
   * $.upload({
   *  api: {string} 后端上传服务api地址
   *  $fileinputs: {ArrayLike}  元素集合，必须全为file input
   *  data: {object | function}  除了上传的文件外需要额外传输的数据（经常后端需要）。如果传入匿名函数则取返回值为data
   *  sizeLimit: {number | object} 文件大小限制, 单位KB。传入一个数字则为最大size；传入对象则是{min:1000,max:3000}形式，max必须比min大。该参数只在IE9以上及现代浏览器、千牛有效。且服务器端校验仍是必须的。
   *  success: {function}  上传网络层成功后的回调（注意业务逻辑可能使这次上传失败无效）
   * })
   */
  $.extend({
    upload: function(opt) {
      var $fileinputs = opt.$fileinputs || [];
      $.each($fileinputs, function(k, v){
        var type = $(v).prop('type');
        if ( type != 'file') {
          throw Error('upload——传入控件类型应为file，实际有type为' + type + '的控件!');
        }
      })
      $fileinputs.on('change.upload', function(e) {
        if (!$(this).val()) return;
        var fileinput = this
          , param = getParam(fileinput)
          , sl = opt.sizeLimit
          , ret;
        //有大小限制需求且是有files接口的浏览器环境
        if (sl && fileinput.files) {
          //文件大小限制
          ret = checkSize.apply(fileinput, typeof sl == 'number' ? [sl * 1024] : (typeof sl == 'object' ? [sl.max * 1024, sl.min * 1024] : []));
          //处理大小判断结果
          if (!ret.isok) {
            $.alert({
              title: '上传文件不合法'
              ,body: '<div class="sui-msg msg-large msg-block msg-error"><div class="msg-con">' + ret.errMsg + '</div><s class="msg-icon"></s></div>'
              ,timeout: 2000
              ,bgColor: '#fff'
            }); 
            return;
          }
        }
        //上传
        $.ajax(opt.api || '', param).success(function(data) {
          if (typeof opt.success == 'function') {
            opt.success.call(fileinput, data);
          }
        });
      });
    }
  })

})(jQuery);
/* jshint ignore:end */
