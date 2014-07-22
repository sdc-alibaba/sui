$(function () {
  var deps = {
    "button-groups": "buttons",
    "checkbox": "icons",
    "dropdown": "icons",
    "steps": "buttons",
    "intro": "buttons",
    "dialog": "buttons"
  }


  $(document).on("change", "input", function(e) {
    var $target = $(e.target);
    var checked = $target.is(":checked");
    var currentId = $target.attr("id");
    for(var n in deps) {
      var v = deps[n];
      if (currentId == n && checked) {
        $("#"+v).prop("checked", true).trigger("change");
      }
      if(currentId == v && !checked) {
        $("#"+n).prop("checked", false).trigger("change");
      }
    }
  });
});
