"use strict";

var App = App || {};

// document initialization promise
let documentReadyPromise = new Promise(function(resolve, reject) {
  $(document).ready(resolve);
});

Promise.all([less.pageLoadFinished, documentReadyPromise])
  .then(function() {
    App.init();
  });

window.onresize = function() {
  App.resize();
};

(function() {
  App.models = {};
  App.views = {};
  App.controllers = {};


  App.init = function() {
    console.log("body loaded");

    App.views.cpu = new CpuView("#cpuSection");
    App.views.disk = new DiskView("#diskSection");
    App.views.gpu = new GpuView("#gpuSection");
    
    App.controllers.dataUpdate = new DataUpdateController();
  };

  App.resize = function() {
    // resize all views
    for(let view of Object.values(App.views)) {
      view.resize();
    }
  }

})();
