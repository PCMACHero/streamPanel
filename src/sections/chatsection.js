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
        this.modDiv = null
        this.myDivs = []
        this.myReturn = this.myDivs.slice(0);
        this.modalClass = "hide-modal"
        
        this.badgeClass = "is-mod"
        this.modUnmod = null;

        this.options = {
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
        
        this.client = new tmi.client(this.options);
        
      
            
        this.client.connect();
        
        

    }
    
    
    
    state = {
        modStatus: null,
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
        var counter = 0;
        
        this.client.on('chat', (channel, user, message, self)=>{
            
            this.client.mods("streampanelapp").then(data =>{
                // data returns [moderators]
                console.log("CURRENT MODS", data)
                
                if(data.includes(user.username)){
                    
                    

                    this.setState({
                        modStatus:"UNMOD"
                    })
                    console.log("MADE IT TO 2C and it is UNMOD", this.state.modStatus)
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
                this.client.action("streampanelapp", `Hola, ${user.username}`).then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }}>Message</div>
                
                <div className="btn blue" onClick={()=>{
                            
                            this.client.unmod("streampanelapp", user.username).then(function(data) {
                                // data returns [channel, username]
                                console.log(data)
                            }).catch(function(err) {
                                //
                                console.log(err)
                            });
                        
                    }}>{this.state.modStatus}</div>
                <div className="btn red">Ban</div>
                <div className="btn red">Timeout</div>
                <div>{JSON.stringify(user.badges)}</div>
                <div>{JSON.stringify(channel)}</div>
                </div>
                
                {/* <p>info: { JSON.stringify(user, null, 4)}</p> */}
                
              </Modal>
        
        )
                    } else { 

                    
                        
                    this.setState({
                        modStatus:"MOD"
                    })
                    console.log("MADE IT TO 2C and it is MOD", this.state.modStatus)
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
                this.client.action("streampanelapp", `Hola, ${user.username}`).then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }}>Message</div>
                
                <div className="btn blue" onClick={()=>{
                            
                            this.client.mod("streampanelapp", user.username).then(function(data) {
                                // data returns [channel, username]
                                console.log(data)
                            }).catch(function(err) {
                                //
                                console.log(err)
                            });
                        
                    }}>{this.state.modStatus}</div>
                <div className="btn red" onClick={()=>{
                    this.client.ban("streampanelapp", user.username, "reason").then(function(data) {
                        // data returns [channel, username, reason]
                        console.log(user.username, " has been banned")
                    }).catch(function(err) {
                        //
                        console.log(err)
                    });
                }}>Ban</div>
                <div className="btn red">Timeout</div>
                <div>{JSON.stringify(user.badges)}</div>
                <div>{JSON.stringify(channel)}</div>
                </div>
                
                {/* <p>info: { JSON.stringify(user, null, 4)}</p> */}
                
              </Modal>
        
        )
                }
            }).catch(function(err) {
                //
            });
            

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
                this.client.action("streampanelapp", "Your test message, hola").then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }
            
        
            if(this.myDivs.length > 30) {
                this.myDivs.shift()
            }
            // console.log(user);
            // this.setState({
            //     message:message,
            //     userName:user.username,
            //     color: user.color
            // })
            const chatSec = document.getElementById('chat-section');
            chatSec.scrollTop = chatSec.scrollHeight;
            

            
            
            


        
    
    })}

    render(){
        
        
        return (
            this.myDivs
            
       )
            
        
    }
}