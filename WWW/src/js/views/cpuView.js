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

    let side = d3.min([width, height]);

    self.svg = self.div.append("svg")
      .attr("width", side)
      .attr("height", side)
      .attr("viewBox", [0, 0, side, side].join(" "));

    self.dimension = side;
  }

  function drawCpuUtil(cpuData) {
    let outerMargin = 25;
    let innerMargin = 10;

    let side = self.dimension;

    self.svg.selectAll("*").remove();

    let infoPaneWidth = side / 4 - outerMargin - innerMargin / 2;
    // let infoPaneHeight = side - outerMargin * 2;
    let infoPaneHeight = (3 * side / 4) - outerMargin - innerMargin / 2;
    let infoPaneOffset = {
      x: outerMargin,
      y: outerMargin
    };

    let piePaneWidth = (3 * side / 4) - outerMargin - innerMargin / 2;
    let piePaneHeight = piePaneWidth;
    let piePaneOffset = {
      x: side / 4 + innerMargin / 2,
      y: outerMargin
    };

    // let barPaneWidth = (3 * side / 4) - outerMargin - innerMargin / 2;
    let barPaneWidth = side - 2 * outerMargin;
    let barPaneHeight = side / 4 - outerMargin - innerMargin / 2;
    let barPaneOffset = {
      x: outerMargin,
      // x: side / 4 + innerMargin / 2,
      y: (3 * side / 4) + innerMargin / 2
    };

    // draw info
    // height of one pair of text
    let textHeight = 25 + 12 + 4;
    let textCenter1 = infoPaneHeight / 4;
    let textCenter2 = 3 * infoPaneHeight / 4;

    let infoGroup = self.svg.append("g")
      .attr("transform", `translate(${infoPaneOffset.x}, ${infoPaneOffset.y})`);

    let numberSign = infoGroup.append("text")
      .attr("class", "infoText")
      .attr("x", infoPaneWidth / 2)
      .attr("y", textCenter1 - textHeight / 2 + 12)
      .text("# CPU");

    let numberCPU = infoGroup.append("text")
      .attr("class", "mainText")
      .attr("x", infoPaneWidth / 2)
      .attr("y", textCenter1 + textHeight / 2)
      .text(cpuData.num);

    let speedNumber = infoGroup.append("text")
      .attr("class", "mainText")
      .attr("x", infoPaneWidth / 2)
      .attr("y", textCenter2 - textHeight / 2 + 25)
      .text((cpuData.speed/1000).toFixed(1));

    let speedUnits = infoGroup.append("text")
      .attr("class", "infoText")
      .attr("x", infoPaneWidth / 2)
      .attr("y", textCenter2 + textHeight / 2)
      .text("GHz");

    // draw pie
    let outerRadiusMax = piePaneWidth / 2 - innerMargin / 4;
    let innerRadiusMin = 2 * outerRadiusMax / 3;

    let arcThickness = outerRadiusMax - innerRadiusMin;

    let breakdownData = [{
        type: "system",
        percent: cpuData.system
      },
      {
        type: "user",
        percent: cpuData.user
      },
      {
        type: "wio",
        percent: cpuData.wio
      },
      {
        type: "idle",
        percent: cpuData.idle
      }
    ];

    let utilizationData = [{
        type: "user",
        percent: cpuData.utilization
      },
      {
        type: "idle",
        percent: cpuData.idle
      }
    ];

    let arc = d3.arc()
      .innerRadius(function(d) {
        return innerRadiusMin + (d.data.type === "idle" ? arcThickness / 4 : 0);
      })
      .outerRadius(function(d) {
        return outerRadiusMax - (d.data.type === "idle" ? arcThickness / 4 : 0);
      })

    let pieGen = d3.pie()
      // .padAngle(0.01)
      .value(d => d.percent);

    let pie = pieGen(cpuData.utilization > 5 ? breakdownData : utilizationData);

    let pieGroup = self.svg.append("g")
      .attr("transform", `translate(${piePaneOffset.x}, ${piePaneOffset.y})`);


    let pieG = pieGroup.append("g")
      .attr("transform", `translate(${outerRadiusMax}, ${outerRadiusMax})`);

    pieG.append("circle")
      .attr("class", "track")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (outerRadiusMax + innerRadiusMin) / 2);

    pieG.selectAll(".utilArc")
      .data(pie)
      .enter().append("path")
      .attr("class", d => d.data.type + "Arc")
      .attr("d", arc);

    // add text in middle
    pieGroup.append("text")
      .attr("class", "mainText")
      .attr("transform", `translate(${piePaneWidth/2}, ${piePaneHeight/2 - 2})`)
      .text(cpuData.utilization.toFixed(2) + "%");

    // draw bar
    let barHeight = barPaneHeight - 20;
    let barWidth = barPaneWidth;

    // shift by panel offset automatically
    let barGroup = self.svg.append("g")
      .attr("transform", `translate(${barPaneOffset.x}, ${barPaneOffset.y})`);

    // draw bar info text
    let systemText = barGroup.append("text")
      .attr("x", 0)
      .attr("y", 12)
      .attr("class", "systemText")
      .text("System");

    let usedText = barGroup.append("text")
      .attr("x", barWidth / 2)
      .attr("y", 12)
      .attr("class", "userText")
      .text("User");

    let wioText = barGroup.append("text")
      .attr("x", barWidth)
      .attr("y", 12)
      .attr("class", "wioText")
      .text("I/O");


    // bar scale
    let barWidthScale = d3.scaleLinear()
      .domain([0, cpuData.system + cpuData.user + cpuData.wio])
      .range([0, barWidth - 10]);

    // draw bar with 2 values
    let systemWidth = barWidthScale(cpuData.system);

    let systemBar = barGroup.append("rect")
      .attr("class", "systemBar")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", systemWidth)
      .attr("height", barHeight);

    let userWidth = barWidthScale(cpuData.user);
    let userBar = barGroup.append("rect")
      .attr("class", "userBar")
      .attr("x", systemWidth + 5)
      .attr("y", 20)
      .attr("width", userWidth)
      .attr("height", barHeight);

    let wioBar = barGroup.append("rect")
      .attr("class", "wioBar")
      .attr("x", systemWidth + userWidth + 10)
      .attr("y", 20)
      .attr("width", barWidthScale(cpuData.wio))
      .attr("height", barHeight);
  }

  function resize() {
    let width = self.div.node().clientWidth;
    let height = self.div.node().clientHeight;

    let side = d3.min([width, height]);

    self.svg
      .attr("width", side)
      .attr("height", side);
  }

  return {
    drawCpuUtil,

    resize
  };
};
