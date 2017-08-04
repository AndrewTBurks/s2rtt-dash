"use strict";

var App = App || {};

let Sage2View = function(div) {
  let self = {
    div: null,
    container: null
  };

  init();

  function init() {
    self.div = d3.select(div);

    createContainer();
  }

  function createContainer() {
    let body = self.div.select(".sectionBody");

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height

    self.container = body.append("div")
      .style("width", width + "px")
      .style("height", height + "px")
      .style("max-height", height + "px");
  }

  function updateSAGE2Containers(sage2Data) {

  }

  function resize() {

  }

  return {
    resize,
    updateSAGE2Containers
  };
};
