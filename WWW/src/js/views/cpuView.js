"use strict";

var App = App || {};

let CpuView = function(div) {
  let self = {
    div: null,
    svg: null,

    width: null,
    height: null
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
      .attr("viewBox", [0, 0, width, height].join(" "));

    self.width = width;
    self.height = height;
  }

  function drawCpuUtil(cpuData) {
    let outerMargin = 25;
    let innerMargin = 10;

    let width = self.width;
    let height = self.height;

    self.svg.selectAll("*").remove();

    let infoPaneWidth = width - 2 * outerMargin;
    let infoPaneHeight = (height / 4) - outerMargin - innerMargin / 2;
    let infoPaneOffset = {
      x: outerMargin,
      y: outerMargin
    };

    let piePaneWidth = width - 2 * outerMargin;
    let piePaneHeight = height / 2 - innerMargin;
    let piePaneOffset = {
      x: outerMargin + (width - (outerMargin * 2) - piePaneWidth) / 2,
      y: (height / 4) + (height / 2 - piePaneHeight) / 2
    };

    let barPaneWidth = width - 2 * outerMargin;
    let barPaneHeight = height / 4 - outerMargin - innerMargin / 2;
    let barPaneOffset = {
      x: outerMargin,
      y: (3 * height / 4) + innerMargin / 2
    };

    // draw info
    // height of one pair of text
    let textHeight = 25 + 12 + 4;
    let textCenter1 = infoPaneWidth / 2 - 20;
    let textCenter2 = infoPaneWidth / 2 + 20;

    let textCenter3 = infoPaneWidth / 2;

    let infoGroup = self.svg.append("g")
      .attr("transform", `translate(${infoPaneOffset.x}, ${infoPaneOffset.y})`);

    let numberCPU = infoGroup.append("text")
      .attr("class", "mainText")
      .attr("x", textCenter1)
      .attr("y", infoPaneHeight / 2)
      .style("text-anchor", "end")
      .text(cpuData.num);

    let speedNumber = infoGroup.append("text")
      .attr("class", "mainText")
      .attr("x", textCenter2)
      .attr("y", infoPaneHeight / 2)
      .style("text-anchor", "start")
      .text((cpuData.speed / 1024).toFixed(1));

    let numberSign = infoGroup.append("text")
      .attr("class", "infoText")
      .attr("x", textCenter1)
      .attr("y", infoPaneHeight / 2 + 13)
      .style("text-anchor", "end")
      .text("CPU");

    let speedUnits = infoGroup.append("text")
      .attr("class", "infoText")
      .attr("x", textCenter2)
      .attr("y", infoPaneHeight / 2 + 13)
      .style("text-anchor", "start")
      .text("GHz");

    infoGroup.append("text")
      .attr("class", "infoText")
      .attr("x", textCenter3)
      .attr("y", infoPaneHeight / 2 - 4)
      .style("text-anchor", "middle")
      .text("at");

    // draw pie
    let outerRadiusMax = d3.min([piePaneWidth, piePaneHeight]) / 2 - innerMargin / 4;
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
      .attr("transform", `translate(${piePaneWidth/2}, ${piePaneHeight/2})`);

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
      .attr("transform", `translate(${piePaneWidth/2}, ${piePaneHeight/2 + 5})`)
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
    let body = self.div.select(".sectionBody");

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height

    let side = d3.min([width, height]);

    self.svg
      .attr("width", width)
      .attr("height", height);
  }

  return {
    drawCpuUtil,

    resize
  };
};
