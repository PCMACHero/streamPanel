const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

// Declare some events to listen for.
// obs.onConnectionOpened(() => {
//   console.log('Connection Opened');

//   // Send some requests.
//   obs.getSceneList({}, (err, data) => {
//     console.log("Using callbacks:", err, data);
//   });

//   obs.getSceneList().then(data => {
//     console.log("Get scene list object:", data.scenes);
//   });
//   // obs.getSourcesList().then(data => {
//   //   console.log("Get source list object:", data);
    
//   // });
 
//   // obs.getSourceSettings({'sourceName':'camera'}).then(data => {
//   //   console.log("Get source settings object:", data);
//   // });
 
//   // obs.getBrowserSourceProperties({'source':'Browser'}).then(data => {
//   //   console.log("Get BROWSER object:", data);
//   // });

//   // obs.getMute({'source':'Mic/Aux'}).then(data=>{
//   //     console.log("GET MUTE OBJECT: ", data)
//   // });
 

//   // obs.setMute({'source':'Mic/Aux','mute':true});

// //   obs.toggleMute({ 'source': "Mic/Aux" }).then(res => {
// //     console.log("TOGGLE MUTE: ", res,);
// // });

  
// });

obs.onSwitchScenes(data => {
  console.log("Current Scene is now: ",data["scene-name"]);
});

// setTimeout(function(){
  obs.connect();
  console.log("@@@@@@@");

obs.onConnectionOpened(() => {
  console.log("#######");
  obs.getSceneList().then(data => {
    
    // obs.setCurrentScene({
    //       'scene-name': scene.name
    //     });
    //   console.log("CURRENT SCENE IS: ",scene.name)
      
    
  })
});

export default obs;
