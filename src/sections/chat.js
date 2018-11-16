import React from 'react';
import tmi from "tmi.js";







// Connect the client to the server..
const chat = ()=> {
    
    var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        // identity: {
        //     username: "twboapp",
        //     password: "oauth:"
        // },
        channels: ["shroud"]
    };
    var client = new tmi.client(options);
    
    
        
    client.connect();
    let myMessage="";
    
    client.on('chat', (channel, user, message, self)=>{
        document.getElementById('chat').innerHTML = (user["display-name"]+" CHAT WORKS: "+ message);
       myMessage = message;
        
    })
    return <div>{myMessage}</div>
    }
    



export default chat;
