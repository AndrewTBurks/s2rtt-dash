let fs = require('fs');

let request = require('request');
let express = require('express');
let _ = require('lodash');

let smi = require('node-nvidia-smi');
let si = require('systeminformation');
let df = require('node-df');

let app = express();

let smiData = {};
let siData = {};
let dfData = {};

let system = {};
let sage2cloud = {};

app.listen(80, function() {
  console.log("Dashboard served on 80");
});

app.use(express.static('WWW'));

app.get('/api/json/', function(req, res) {
  res.type('application/json');
  res.send({
    system,
    sage2cloud,
    dfData,
    smiData,
    siData
  });
});

smiDataUpdate();

// system information
si.getStaticData(function (data) {
    siData = data;
});


// start data update cycle
let dataUpdateInterval = setInterval(function() {
    sFlowDataUpdate();
    dfDataUpdate();
    smiDataUpdate();
    sage2_dockerUpdate();
}, 1000);

// sage2rtt sflow endpoint
let api = "http://sage2rtt.evl.uic.edu:8008/metric/131.193.183.208/json";

function sFlowDataUpdate() {
  let date = Date.now();

  request(api, function(error, response, body) {
    let data = JSON.parse(body);
    // console.log(data);

    let keys = {
      cpu: "2.1.cpu",
      //gpu: "2.1.nvml", // gpu from nvidia-smi
      //disk: "2.1.disk", // disk from df
      mem: "2.1.mem",
      bytes: "2.1.bytes",
      pkts: "2.1.pkts",
      tcp: "2.1.tcp",
      udp: "2.1.udp"
    };

    system = {};
    // sage2cloud = {};

    for (let datatype of Object.keys(keys)) {
      let tag = keys[datatype];
      system[datatype] = {};
      
      _.forEach(_.filter(Object.keys(data), (propname) => _.includes(propname, tag)), (propname) => {
        system[datatype][propname.slice(tag.length + 1)] = data[propname];
      });
    }

    // host ids of processes that are sage2 cloud servers
//     let sage2hostIDs = _.map(
//       _.filter(Object.keys(data), (key) => _.includes(key, ".vir_host_name") && _.includes(data[key], "sage2-")),
//       hostID => hostID.slice(0, -1 * ".vir_host_name".length)
//     );

//     _.forEach(sage2hostIDs, id => {
//       sage2cloud[id] = {};

//       _.forEach(_.filter(Object.keys(data), (key) => _.includes(key, id)), (serverKey) => {
//         sage2cloud[id][serverKey.slice(id.length + 1)] = data[serverKey];
//       });
//     });
    // console.log("System State updated", date);
  });
}

function dfDataUpdate() {
    let mountPoints = ["/", "/bigdata", "/iridium", "/extreme"]; 
    
    df(function (error, response) {
        if (error) { throw error; }
        
        dfData = _.filter(response, drive => _.includes(mountPoints, drive.mount));
    });   
}

function smiDataUpdate() {
    let keys = {
        "nvidia_smi_log": {
            "timestamp": true,
            "attached_gpus": true,
            "gpu": {
                "product_name": true,
                "gpu_virtualization_mode": true,
                "fan_speed": true,
                "performance_state": true,
                "fb_memory_usage": true,
                "bar1_memory_usage": true,
                "compute_mode": true,
                "utilization": true,
                "temperature": true,
                "power_readings": {
                    "power_draw": true,
                    "power_limit": true
                },
                "processes": {
                    "process_info": true
                }
            }
        }   
    };
    
    smi(function (err, data) {
        // handle errors 
        if (err) {
            console.warn(err);
            process.exit(1);
        }

        // display GPU information 
        smiData = {};
        
        for (let key of Object.keys(keys)) {
            smiData[key] = {};
            copyValue(key, data, smiData, keys);
        }
    });
    
    
    
    function copyValue(key, from, to, keyobj) {
        if (typeof keyobj[key] === "object") {
            for (let subkey of Object.keys(keyobj[key])) {
                to[key][subkey] = {};
                copyValue(subkey, from[key], to[key], keyobj[key]);
            }
        } else {
            to[key] = from[key];
        }
    }
}

function sage2_dockerUpdate() {
    sage2cloud = {};
    si.dockerAll(function (data) {
        sage2cloud = _.filter(data, docker => _.includes(docker.name, "sage2-"));
    });
}