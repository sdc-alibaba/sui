(function() {
  requirejs.config({
    paths: {
      "jquery": "lib/jquery-1.10.2",
      "backbone": "lib/backbone",
      "underscore": "lib/underscore",
      "almond": "lib/almond"
    },
    shim: {
      "backbone": {
        deps: ["underscore", "jquery"]
      }
    }
  });

}).call(this);
