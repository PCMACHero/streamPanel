
const find = require('local-devices');
const isPortReachable = require('is-port-reachable');
 



const funcGetIP=()=>{
        console.log("tried to get ip")
        // Find all local network devices.
    find().then(devices => {
        console.log("pew", devices)    
        devices.forEach(i=>{
            isPortReachable(4444, {host: i.ip}).then(reachable => {
                if(reachable){
                    console.log("This is the IP", i.ip)
                }
                console.log(reachable);
                
            });
        })
    
   
  })
    }

    funcGetIP()