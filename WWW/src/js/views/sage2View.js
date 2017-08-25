"use strict";

var App = App || {};

let Sage2View = function(div) {
  let self = {
    div: null,
    body: null,

    servers: null,
    data: {}
  };

  init();

  function init() {
    self.div = d3.select(div);
    self.servers = ko.observableArray([]);
    
    createContainer();
    ko.applyBindings(self);
  }

  function createContainer() {
    let body = self.body = self.div.select(".sectionBody");

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight - 5; // - section header height

    self.body
      .style("height", height + "px")
      .style("max-height", height + "px");

  }

  function updateSAGE2Containers(sage2Data) {
      if (sage2Data[0]) {
        self.servers.removeAll();
        for (let server of sage2Data) {
          self.servers.push(server);
        }   
      }
  }

  function resize() {
    let body = self.body;

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight - 5; // - section header height

    self.body
      .style("height", height + "px")
      .style("max-height", height + "px");
  }

  return {
    resize,
    updateSAGE2Containers
  };
};
