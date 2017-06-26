"use strict";

var App = App || {};

let CpuView = function(div) {
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

  function drawCpuUtil(cpuData) {
    let margin = 10;

    let width = +self.svg.attr("width"),
      height = +self.svg.attr("height");

    let barHeight = 20;
    let barWidth = width - (2 * margin);

    let circleHeight = height - (2 * margin) - barHeight - 16;

    // draw bar
    let barWidthScale = d3.scaleLinear()
      // .domain([0, ])
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
