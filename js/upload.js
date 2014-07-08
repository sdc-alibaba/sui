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
            // The second load event gets fired when the response to the form
            // submission is received. The implementation detects whether the
            // actual payload is embedded in a `<textarea>` element, and
            // prepares the required conversions to be made in that case.
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

  /*
   * $.upload({
   *  api: {string} 后端上传服务api地址
   *  $fileinputs: {ArrayLike}  元素集合，必须全为file input
   *  data: {object}  除了上传的文件外需要额外传输的数据（经常后端需要）
   *  triggerType: {string} 触发上传的方式，可选值为有效的事件类型，如click,change,mouseup等，默认‘change’。必须结合triggerEle使用。如果不传全则默认file input change时上传文件。
   *  triggerEle: {string|HTMLElement}  触发上传的元素，必须结合triggerType使用。如果不传全则默认file input change时上传文件。
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

      $fileinputs.on('change', function(e) {
        var fileinput = this
          , data = opt.data
          , param = {
            type: 'post',
            dataType: 'json',
            files: fileinput,
            upload: true
          };
        if (typeof opt.data == 'function') {
          data = opt.data.call(this);
        }
        if (data) {
          $.extend(param, {
            data: data,
            processData: false
          })
        }
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
