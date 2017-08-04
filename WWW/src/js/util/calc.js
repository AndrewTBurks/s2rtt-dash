"use strict";

var App = App || {};
App.util = App.util || {};

(function() {
  App.util.calc = {
    BtoGB: function(bytes) {
      return (bytes/1073741824).toFixed(2);
    }
  };
})();
