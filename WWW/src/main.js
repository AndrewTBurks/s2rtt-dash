"use strict";

var App = App || {};

(function() {
  App.init = function() {
    console.log("body loaded");

    serverDataUpdate();

    App.dataUpdateInterval = setInterval(function() {
      serverDataUpdate();
    }, 5000);
  };


  function serverDataUpdate() {
    let req = new XMLHttpRequest();
    req.open("GET", "http://localhost:6969/api/json/");

    req.onload = newDataLoaded;

    req.onerror = function(err) {
      console.log(err);
    }

    req.send();
    
    function newDataLoaded() {
      console.log(JSON.parse(req.response));
    }
  }

})();
