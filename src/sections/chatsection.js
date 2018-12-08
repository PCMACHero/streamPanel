import React, {Component} from 'react';
// import Chat from './chat'
import tmi from "tmi.js";
import {streamer} from "../helpers/dummydata"
import {Modal} from "react-materialize"
import axios from "axios";
import {clientID} from "../common/common"
import { isIPv4 } from 'net';


export default class Chat extends Component {
    constructor(props){
        super(props)
        this.myDivs = []
        this.myReturn = this.myDivs.slice(0);
        this.modalClass = "hide-modal"
        
        this.badgeClass = "is-mod"
        
        

    }
    
    
    
    state = {
        message: "",
        userName: "",
        color: "",
        modal: false,
        badges: null
        
        }
    getEmotes(){
        const headers = {
            headers:{
                accept: "application/vnd.twitchtv.v5+json",
                "Client-ID": clientID
            }
        }
        const myURL = `https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0`
        axios.get(myURL,headers).then(resp=>{
            
            console.log("MY AXIOS EMOTES ", resp.data["emoticon_sets"][0])
        })
    }
        
    componentDidMount(){
        // this.getEmotes();
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
            let newMessage;
            if(/LUL/g.test(message)){
                console.log('found')
                newMessage = <div> Hello HELLO hello HELLO hello</div>
            } else {
                newMessage = message;
            }
            //const newMessage = message.replace(/LUL/g, )
            var badgeArray = []
            // console.log(user)
            if(user.badges !== null){
                if(user.badges.moderator){
                    badgeArray.push(<img key={counter}className={this.badgeClass} src={this.props.chanBadges.mod.image} />)
                }
                if(user.badges.subscriber){
                    badgeArray.push(<img className={this.badgeClass} key={counter+=1} src={this.props.chanBadges.subscriber.image} />)
                }
            }
            
            
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
              <div className="badges">{badgeArray}</div>
              
              <div className="chat-name" style={{color:user.color}}>{user.username}</div>
              
              <div className="chat-message" key={counter+=1}>: {newMessage}</div>
              
          </div>}>
                  <header>{ (user.username).toUpperCase()}</header>
                  <div className="modal-btn-box">
                  <div className="btn purple" onClick={()=>{
                client.action("streampanelapp", `Hola, ${user.username}`).then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }}>Message</div>
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