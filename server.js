let request = require('request');
let express = require('express');
let _ = require('lodash');

let app = express();

let timeData = {};

let system = {};
let sage2cloud = {};

app.listen(6969, function() {
  console.log("Dashboard served on 6969")
});

app.use(express.static('WWW'));

app.get('/api/json/', function(req, res) {
  res.type('application/json');
  res.send({
    system,
    sage2cloud
  });
});


// start data update cycle
let dataUpdateInterval = setInterval(function() {
  sFlowDataUpdate();
}, 5000);

// sage2rtt sflow endpoint
let api = "http://sage2rtt.evl.uic.edu:8008/metric/131.193.183.208/json";

function sFlowDataUpdate() {
  let date = Date.now();

  request(api, function(error, response, body) {
    let data = JSON.parse(body);
    // console.log(data);

    system = {
      cpu: {},
      gpu: {},
      disk: {}
    };

    sage2cloud = {};

    let cputag = "2.1.cpu";
    _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, cputag)), (cpuKey) => {
      system.cpu[cpuKey.slice(cputag.length + 1)] = data[cpuKey];
    });

    let gputag = "2.1.nvml";
    _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, "2.1.nvml")), (gpuKey) => {
      system.gpu[gpuKey.slice(gputag.length + 1)] = data[gpuKey];
    });

    let disktag = "2.1.disk";
    _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, "2.1.disk")), (diskKey) => {
      system.disk[diskKey.slice(disktag.length + 1)] = data[diskKey];
    });

    // host ids of processes that are sage2 cloud servers
    let sage2hostIDs = _.map(
      _.filter(Object.keys(data), (key) => _.includes(key, ".vir_host_name") && _.includes(data[key], "sage2-")),
      hostID => hostID.slice(0, -1 * ".vir_host_name".length)
    );

    _.forEach(sage2hostIDs, id => {
      sage2cloud[id] = {};

      _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, id)), (serverKey) => {
        sage2cloud[id][serverKey.slice(id.length + 1)] = data[serverKey];
      });
    });

    // console.log("System State updated", date);
  });
}
