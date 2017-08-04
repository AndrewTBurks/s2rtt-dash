"use strict";

var App = App || {};

let MemView = function(div) {
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

  function drawMemUtil(memData) {
    console.log(App.util.calc.BtoGB(memData.used) + " GB used");
    console.log(App.util.calc.BtoGB(memData.free) + " GB free");
    console.log(App.util.calc.BtoGB(memData.cached) + " GB cached");
    console.log(App.util.calc.BtoGB(memData.buffers) + " GB buffers");

    console.log(App.util.calc.BtoGB(memData.total) + " GB total");
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
    drawMemUtil,
    resize
  };
};
