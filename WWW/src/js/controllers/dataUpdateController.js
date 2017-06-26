"use strict";

var App = App || {};

let DataUpdateController = function() {
  let self = {
    dataUpdateInterval: null
  };

  init();

  function init() {
    // start periodic data update
    startPeriodicDataUpdate();

    // stopPeriodicDataUpdate(); // comment out normally
  };

  function startPeriodicDataUpdate() {
    // load once immediately
    serverDataUpdate();

    self.dataUpdateInterval = setInterval(function() {
      serverDataUpdate();
    }, 5000);
  }

  function stopPeriodicDataUpdate() {
    clearInterval(self.dataUpdateInterval);
  }

  function serverDataUpdate() {
    let req = new XMLHttpRequest();
    req.open("GET", "/api/json/");

    req.onload = newDataLoaded;

    req.onerror = function(err) {
      console.log(err);
    }

    req.send();

    function newDataLoaded() {
      let data = JSON.parse(req.response);
      // console.log(JSON.parse(req.response));

      App.views.disk.drawDiskUtil(data.system.disk);
    }
  }

  return {
    startPeriodicDataUpdate,
    stopPeriodicDataUpdate
  };
};
