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
    }, 1000);
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

      console.log(data);

      App.views.cpu.drawCpuUtil(data.system.cpu);
      App.views.mem.drawMemUtil(data.system.mem);
      App.views.disk.drawDiskUtil(data.system.disk);
      App.views.gpu.drawGpuUtil(data.system.gpu);

      App.views.sage2.updateSAGE2Containers(data.sage2cloud);
    }
  }

  return {
    startPeriodicDataUpdate,
    stopPeriodicDataUpdate
  };
};
