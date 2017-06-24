let request = require('request');
let express = require('express');
let Docker = require('node-docker-api').Docker;

let app = express();
let docker = new Docker({ socketPath: '/var/run/docker.sock' });

let data = null;

app.listen(6969, function() {
  console.log("Dashboard served on 6969")
});

app.use(express.static('WWW'));

app.get('/api/json/', function(req, res) {
  res.type('application/json');
  res.send(data);
});

let api = "http://sage2rtt.evl.uic.edu:8008/metric/131.193.183.208/json";

request(api, function(error, response, body) {
  data = JSON.parse(body);
  console.log(data);

  let nvidia = {};
});

// docker.container.list()
//   .then((containers) => containers.map(container => container.status()))
//   .then((containerStatuses) => containerStatuses.map(containerStatus => containerStatus.stats()))
//   .then((stats) => stats.forEach(stat => {
//       stat.on('data', (stat) => console.log('Stats: ',stat))
//       stat.on('error', (err) => console.log('Error: ', err))
//     }));
