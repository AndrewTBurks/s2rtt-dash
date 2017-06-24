"use strict";

var App = App || {};

(function() {
  App.init = function() {
    console.log("body loaded");
  };

  let req = new XMLHttpRequest();
  req.open("GET", "localhost:6969/api/json/");

  req.onload = function(evt) {
    console.log(evt);
  }

  req.onerror = function(evt) {
    console.log(evt);
  }

  req.send();

})();
