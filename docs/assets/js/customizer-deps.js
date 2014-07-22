$(function () {
  var deps = {
    "button-groups": ["buttons"],
    "checkbox": ["icons"],
    "dropdown": ["icons"],
    "autocomplete": ["dropdown"],
    "steps": ["buttons"],
    "intro": ["buttons"],
    "dialog": ["buttons"],
    "navbar": ["dropdown", "forms", "buttons", "tab"]
  }


  $(document).on("change", "input", function(e) {
    var $target = $(e.target);
    var checked = $target.is(":checked");
    var currentId = $target.attr("id");
    for(var n in deps) {
      var vs = deps[n];
      for(var i = 0; i<vs.length; i++) {
        var v = vs[i];
        if (currentId == n && checked) {
          $("#"+v).prop("checked", true).trigger("change");
        }
        if(currentId == v && !checked) {
          $("#"+n).prop("checked", false).trigger("change");
        }
      }
    }
  });
});
