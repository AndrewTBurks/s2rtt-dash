"use strict";

var App = App || {};

let Sage2View = function(div) {
  let self = {
    div: null,
    svg: null
  };

  init();

  function init() {
    self.div = d3.select(div);


  }

  function resize() {
    
  }

  return {
    resize
  };
};
