import React, {Component} from 'react';
// import Chat from './chat'
import tmi from "tmi.js";
import {streamer} from "../helpers/dummydata"
import {Modal} from "react-materialize"


export default class Chat extends Component {
    constructor(props){
        super(props)
        this.myDivs = []
        this.myReturn = this.myDivs.slice(0);
        this.modalClass = "hide-modal"
        
        

    }
    
    
    
    state = {
        message: "",
        userName: "",
        color: "",
        modal: false,
        
        }
        
        
    componentDidMount(){
        
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
            channels: [streamer]
        };
        
        var client = new tmi.client(options);
        
      
            
        client.connect();

        
        
        var counter = 0;
        
        client.on('chat', (channel, user, message, self)=>{
            if(message==="test me"){
                client.action("streampanelapp", "Your test message, hola").then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }
            this.myDivs.push(<Modal key={counter+=100} className="black"
                // header={ (user.username).toUpperCase()}
                trigger={<div className="chat-card" key={counter+=1} onClick={()=>{
      
                  
                  }}>
              <div className="chat-name" style={{color:user.color}}>{user.username}</div>
              <div className="chat-message" key={counter+=1}>: {message}</div>
              
          </div>}>
                  <header>{ (user.username).toUpperCase()}</header>
                  <div className="modal-btn-box">
                  <div className="btn purple">Message</div>
                <div className="btn blue">Mod</div>
                <div className="btn red">Ban</div>
                <div className="btn red">Timeout</div>
                <div>{JSON.stringify(user.badges)}</div>
                <div>{JSON.stringify(channel)}</div>
                </div>
                
                {/* <p>info: { JSON.stringify(user, null, 4)}</p> */}
                
              </Modal>
        
        )
        
            if(this.myDivs.length > 30) {
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
            

            
            
            


        
    
    })}

    render(){
        
        return (
            this.myDivs
            
       )
            
        
    }
}