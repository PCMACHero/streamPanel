import React, {Component} from 'react';
import tmi from "tmi.js";
import {streamer} from "../helpers/dummydata"


//get channel data (kraken/channel)

var data = null;

var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://api.twitch.tv/kraken/channel");
xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
xhr.setRequestHeader("Client-ID", "qcnyt9qlx36ej3dmou2x16xd36t73x");
xhr.setRequestHeader("Authorization", "OAuth 79hy695c76z72fco69qib7kbof03x7");


xhr.send(data);

class Chat extends Component {
    myDivs = []
    myReturn = this.myDivs.slice(0)
    
    
    state = {
        message: "hello",
        userName: "Miguel",
        color: "white"
        }
        
        
    componentDidMount(){

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
        
        var counter = 1;
        
        client.on('chat', (channel, user, message, self)=>{
            this.myDivs.push(<div className="chat-card" key={counter+=1} onClick={()=>{console.log(user.username)}}>
            <div className="chat-name" style={{color:user.color}}>{user.username}</div>
            <div className="chat-message" key={counter+=1}>: {message}</div>
        </div>)
            if(this.myDivs.length > 20) {
                this.myDivs.shift()
            }
            // console.log(user);
            this.setState({
                message:message,
                userName:user.username,
                color: user.color
            })
            const chatSec = document.getElementById('chat-section');
            chatSec.scrollTop = chatSec.scrollHeight;
            
            
            // var chatSec = document.getElementById("chat-section");
        
            
            // myMessage = document.getElementById('chat-section').innerHTML += ("<div class='chat-card'>"+"<div class='chat-name'>"+user['display-name']+": "+"</div>"+ "<div class='chat-message'> "+" "+message+"</div>"+"</div>");
    
            // if(chatSec.childElementCount > 30) {
            //     chatSec.removeChild(chatSec.children[0]);
            // }}


        
    
    })}

    render(){
        return (
            this.myDivs
            
       )
            
        
    }
}


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
    
        
        myMessage = document.getElementById('chat-section').innerHTML += ("<div class='chat-card'>"+"<div class='chat-name'>"+user['display-name']+": "+"</div>"+ "<div class='chat-message'> "+" "+message+"</div>"+"</div>");

        if(chatSec.childElementCount > 30) {
            chatSec.removeChild(chatSec.children[0]);
        }

        
        
    //    myMessage = message;
        
    })
    return <div>{myMessage}</div>
    
    }
    



export default Chat;
