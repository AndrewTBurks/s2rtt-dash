"use strict";

var App = App || {};

let GpuView = function(div) {
  let self = {
    div: null,
    svg: null
  };

  init();

  function init() {
    self.div = d3.select(div);

    createSVG();
  }

  function createSVG() {
    let width = self.div.node().clientWidth;
    let height = self.div.node().clientHeight;

    self.svg = self.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  function resize() {
    let width = self.div.node().clientWidth;
    let height = self.div.node().clientHeight;

    let side = d3.min([width, height]);

    self.svg
      .attr("width", width)
      .attr("height", height);
  }

  return {
    resize
  };
};
