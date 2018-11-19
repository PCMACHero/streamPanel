import React from 'react';
import tmi from "tmi.js";
import {streamer} from "../helpers/dummydata"







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
        channels: [streamer]
    };
    var client = new tmi.client(options);
    
    
        
    client.connect();
    let myMessage="";
    var counter = 1;
    
    client.on('chat', (channel, user, message, self)=>{
        
        counter+=1
        console.log("counter is: "+counter)
        var chatSec = document.getElementById("chat-section");
    
        // elmnt.scrollTop = 500;
        myMessage = document.getElementById('chat-section').innerHTML += ("<div class='chat-card'>"+"<div class='chat-name'>"+user['display-name']+": "+"</div>"+ "<div class='chat-message'> "+" "+message+"</div>"+"</div>");

        if(chatSec.childElementCount > 30) {
            chatSec.removeChild(chatSec.children[0]);
        }

        
        
    //    myMessage = message;
        
    })
    return <div>{myMessage}</div>
    
    }
    



export default chat;
