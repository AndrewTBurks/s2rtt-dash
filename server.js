let fs = require('fs');
let request = require('request');
let express = require('express');
let Docker = require('node-docker-api').Docker;

let _ = require('lodash');

let app = express();
let docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

// let timeData = {};

let systemState = {};
let dockerState = {};

app.listen(6969, function() {
  console.log("Dashboard served on 6969")
});

app.use(express.static('WWW'));

app.get('/api/json/', function(req, res) {
  res.type('application/json');
  res.send({
    system: systemState,
    docker: dockerState
  });
});


// start data update cycle
let dataUpdateInterval = setInterval(function() {
  sFlowDataUpdate();
  // dockerDataUpdate();
}, 5000);

// sage2rtt sflow endpoint
let api = "http://sage2rtt.evl.uic.edu:8008/metric/131.193.183.208/json";

function sFlowDataUpdate() {
  let date = Date.now();

  request(api, function(error, response, body) {
    let data = JSON.parse(body);
    // console.log(data);

    let organized = {
      cpu: {},
      gpu: {},
      disk: {}
    };

    _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, "2.1.cpu")), (cpuKey) => {
      organized.cpu[cpuKey] = data[cpuKey];
    });

    _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, "2.1.nvml")), (gpuKey) => {
      organized.gpu[gpuKey] = data[gpuKey];
    });

    _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, "2.1.disk")), (diskKey) => {
      organized.disk[diskKey] = data[diskKey];
    });

    systemState = organized;
    // console.log("System State updated", date);
  });
}

docker.container.list()
.then((containers) => containers.map(container => container.status()))
.then((containerStatuses) => containerStatuses.map(containerStatus => containerStatus.stats()))
.then((stats) => stats.forEach(stat => {
  stat.on('data', (stat) => {
    fs.createFileReadStream(stat).pipe(dockerDataUpdate);
  })
  stat.on('error', (err) => console.log('Error: ', err))
}));

function dockerDataUpdate(data) {
  // let api = "http://unix:/var/run/docker.sock:/containers/#{ARGV[0]}/stats";

  console.log(data);
}
