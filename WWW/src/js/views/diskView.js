"use strict";

var App = App || {};

let DiskView = function(div) {
  let self = {
    div: null,
    svg: null,

    dimension: null
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

    let side = d3.min([width, height]);

    self.svg = body.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, side, side].join(" "))
      // .attr("preserveAspectRatio", "xMidYMid");

    self.dimension = side;
  }

  function drawDiskUtil(diskData) {
    let margin = 25;

    let side = self.dimension;

    let outerRadiusMax = self.dimension / 2 - margin;
    let innerRadiusMin = 2 * outerRadiusMax / 3;

    let arcThickness = outerRadiusMax - innerRadiusMin;

    let arcData = [{
        type: "free",
        percent: diskData.free
      },
      {
        type: "used",
        percent: diskData.total - diskData.free
      }
    ];

    let arc = d3.arc()
      .innerRadius(function(d) {
        return innerRadiusMin + (d.data.type === "free" ? arcThickness / 4 : 0);
      })
      .outerRadius(function(d) {
        return outerRadiusMax - (d.data.type === "free" ? arcThickness / 4 : 0);
      })

    let pie = d3.pie()
      .padAngle(0.05)
      .value(d => d.percent)
      (arcData);

    self.svg.selectAll("*").remove();

    let pieG = self.svg.append("g")
      .attr("transform", `translate(${side/2}, ${side/2})`);

    pieG.append("circle")
      .attr("class", "track")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (outerRadiusMax + innerRadiusMin) / 2);

    pieG.selectAll(".utilArc")
      .data(pie)
      .enter().append("path")
      .attr("class", d => "utilArc " + d.data.type)
      .attr("d", arc);

    // add text in middle
    self.svg.append("text")
      .attr("class", "percentage")
      .attr("transform", `translate(${side/2}, ${side/2 - 2})`)
      .text(diskData.utilization.toFixed(2) + "%");

    self.svg.append("text")
      .attr("class", "sizeText")
      .attr("transform", `translate(${side/2}, ${side/2 + 14})`)
      .text(App.util.calc.BtoGB(diskData.total - diskData.free) + " GB / " + App.util.calc.BtoGB(diskData.total) + " GB");
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
    drawDiskUtil,

    resize
  };
};
