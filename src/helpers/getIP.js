
const find = require('local-devices');
const isPortReachable = require('is-port-reachable'),
    requestHelper = require('./requestHelper');

const funcGetIP=()=>{
    // Find all local network devices.
    find().then(devices => {   
        devices.forEach(i=>{
            isPortReachable(4444, {host: i.ip}).then(reachable => {
                if(reachable){
                    console.log("This is the IP", i.ip);
                    requestHelper.xmlRequest({method: "POST", url: "/api/updatelocalip", body: 'ip='.concat(i.ip)}).then(resFromDB => {
                        let parsedResponse = JSON.parse(resFromDB);
                        if (parsedResponse.message === 'Success') {
                            // let the user know?
                            console.log('yay');
                        }
                    });
                }
            });
        })
    })
};

funcGetIP()