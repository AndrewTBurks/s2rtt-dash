let express = require('express');
let Docker = require('node-docker-api').Docker;

let docker = new Docker({ socketPath: '/var/run/docker.sock' });

docker.container.list()
  .then((containers) => containers.map(container => container.status()))
  .then((containerStatuses) => containerStatuses.map(containerStatus => containerStatus.stats()))
  .then((stats) => stats.forEach(stat => {
      stat.on('data', (stat) => console.log('Stats: ',stat))
      stat.on('error', (err) => console.log('Error: ', err))
    }));
