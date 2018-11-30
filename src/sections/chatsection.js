import React, {Component} from 'react';
// import Chat from './chat'
import tmi from "tmi.js";
import {streamer} from "../helpers/dummydata"

export default class Chat extends Component {
    constructor(props){
        super(props)
        this.myDivs = []
        this.myReturn = this.myDivs.slice(0);
        
        

    }
    
    
    
    state = {
        message: "hello",
        userName: "Miguel",
        color: "white"
        }
        
        
    componentDidMount(){
        console.log("LOG OF auth INSIDE CHAT ",this.props.oauth)
        var options = {
            options: {
                debug: true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: "streampanelapp",
                password: "oauth:"+this.props.oauth
            },
            channels: ["#shroud"]
        };
        console.log(options.identity.password)
        var client = new tmi.client(options);
        
      
            
        client.connect();

        
        
        var counter = 1;
        
        client.on('chat', (channel, user, message, self)=>{
            if(message==="test me"){
                client.action("streampanelapp", "Your test message, hola").then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }
            this.myDivs.push(<div className="chat-card" key={counter+=1} onClick={()=>{
                client.action("streampanelapp", "Your test message, hola").then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }}>
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