"use strict";

var App = App || {};

let DiskView = function (div) {
  let self = {
    div: null,
    body: null,

    dimension: null
  };

  init();

  function init() {
    self.div = d3.select(div);

    createSVG();
  }

  function createSVG() {
    self.body = self.div.select(".sectionBody");

    let width = self.width = self.body.node().clientWidth;
    let height = self.height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height

    let side = d3.min([width, height]);

    self.body
      .style("width", "100%")
      .style("height", height+"px");
      // .attr("viewBox", [0, 0, 300, 300].join(" "))
    // .attr("preserveAspectRatio", "xMidYMid");

    self.dimension = 300;
  }

  function drawDiskUtil(diskData) {
    let margin = 25;

    // let side = self.dimension;
      
    let body = self.div.select(".sectionBody");

    let svgWidth = body.node().clientWidth;
    let svgHeight = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height
      
    let width = 300;
    let height = 450;

    let outerRadiusMax = d3.min([width, height]) / 2 - margin;
    let innerRadiusMin = 2 * outerRadiusMax / 3;

    let arcThickness = outerRadiusMax - innerRadiusMin;

    self.body.selectAll("svg").remove();
      
    self.body.selectAll("svg")
        .data(diskData)
    .enter().append("svg")
        .attr("width", svgWidth/2 - 5)
        .attr("height", svgHeight/2 - 5)
        .attr("viewBox", [0, 0, 300, 450].join(" "))
        .attr("preserveAspectRatio", "xMidYMid")
        .each(function(disk) {
            let arcData = [{
                type: "free",
                percent: disk.available
              },
              {
                type: "used",
                percent: disk.used
              }
            ];

            let arc = d3.arc()
              .innerRadius(function (d) {
                return innerRadiusMin + (d.data.type === "free" ? arcThickness / 4 : 0);
              })
              .outerRadius(function (d) {
                return outerRadiusMax - (d.data.type === "free" ? arcThickness / 4 : 0);
              })

            let pie = d3.pie()
              .padAngle(0.05)
              .value(d => d.percent)
              (arcData);
            
            let svg = d3.select(this);
        
            svg.selectAll("*").remove();

            let pieG = svg.append("g")
              .attr("transform", `translate(${width/2}, ${height/2})`);

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
            svg.append("text")
                .attr("class", "diskname")
                .attr("transform", `translate(${width/2}, ${height/2 - outerRadiusMax - 25})`)
                .text(disk.mount);
    
            svg.append("text")
              .attr("class", "percentage")
              .attr("transform", `translate(${width/2}, ${height/2 - 2})`)
              .text((disk.capacity*100).toFixed(2) + "%");

            svg.append("text")
              .attr("class", "sizeText")
              .attr("transform", `translate(${width/2}, ${height/2 + 18})`)
              .text(App.util.calc.KBtoTB(disk.used) + " TB");

            svg.append("line")
              .attr("class", "divisionLine")
              .attr("x1", width / 2 - width / 8)
              .attr("y1", height / 2 + 22)
              .attr("x2", width / 2 + width / 8)
              .attr("y2", height / 2 + 22);

            svg.append("text")
              .attr("class", "sizeText")
              .attr("transform", `translate(${width / 2}, ${height / 2 + 40})`)
              .text(App.util.calc.KBtoTB(disk.size) + " TB");
        });
    
      
      }

  function resize() {
    let body = self.div.select(".sectionBody");

    let width = body.node().clientWidth;
    let height = self.div.node().clientHeight - self.div.select(".sectionHeader").node().clientHeight; // - section header height

    body
      // .style("width", self.width+"px")
      .style("height", height+"px");
      
    console.log(self);
      
    self.body.selectAll("svg")
        .attr("width", (width/2)-5)
        .attr("height", (height/2)-5);
  }

  return {
    drawDiskUtil,

    resize
  };
};