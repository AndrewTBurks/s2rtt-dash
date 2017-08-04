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
    let body = self.div.select(".sectionBody");

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height

    self.svg = body.append("svg")
      .attr("width", width)
      .attr("height", height);

    self.width = width;
    self.height = height;
  }

  function drawMemUtil(memData) {


    console.log(App.util.calc.BtoGB(memData.used) + " GB used");
    console.log(App.util.calc.BtoGB(memData.free) + " GB free");
    console.log(App.util.calc.BtoGB(memData.cached) + " GB cached");
    console.log(App.util.calc.BtoGB(memData.buffers) + " GB buffers");

    console.log(App.util.calc.BtoGB(memData.total) + " GB total");
  }

  function resize() {
    let body = self.div.select(".sectionBody");

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height

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
