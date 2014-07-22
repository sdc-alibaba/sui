!function($) {
  /**
   * filesize  获得计算机文件体积大小(byte)对人更友好的格式
   * @param  {number | string}  可正确转为数字的数字（int、float）、字符串
   * @param  {Object} opt 可选的配置，目前只有保留的小数位数，默认为2
   */
  "use strict";
  $.extend({
    filesize: function(arg, options){
      var result = ""
        , opt = options || {}
        , num = Number(arg)
        , bytes = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        , round = opt.round !== undefined ? opt.round : 2
        , e;

      if (isNaN(arg) || num < 0) {
        throw new Error("无效的size参数");
      }

      if (num === 0) {
        result = "0B";
      }
      else {
        e = Math.floor(Math.log(num) / Math.log(1000));

        if (e > 8) {
          result = result * (1000 * (e - 8));
          e = 8;
        }

        result = num / Math.pow(2, (e * 10));

        result = result.toFixed(e > 0 ? round : 0) + bytes[e];
      }

      return result;
    }
  })
}(jQuery);
