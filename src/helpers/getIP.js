
const find = require('local-devices');
const isPortReachable = require('is-port-reachable'),
    xmlRequest = require('./requestHelper');

const funcGetIP=()=>{
    // Find all local network devices.
    find().then(devices => {   
        devices.forEach(i=>{
            isPortReachable(4444, {host: i.ip}).then(reachable => {
                if(reachable){
                    console.log("This is the IP", i.ip);
                    let responseFromBackend = await xmlRequest({method: "POST", url: "/api/updatelocalip", body: 'ip='.concat(i.ip)});
                    let resFromDB = JSON.parse(responseFromBackend);
                    if (resFromDB.message === 'Success') {
                        // let the user know?
                        console.log('yay');
                    }
                }
            });
        })
    })
};

funcGetIP()