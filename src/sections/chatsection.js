import React, {Component} from 'react';
// import Chat from './chat'
import tmi from "tmi.js";
import {streamer, streamerID} from "../helpers/dummydata"
import {Modal} from "react-materialize"
import axios from "axios";
import {clientID} from "../common/common"
import { isIPv4 } from 'net';
import './chat.css'
// import $ from 'jquery'



export default class Chat extends Component {
    constructor(props){
        super(props)
        this.headers = {
            headers:{
                accept: "application/vnd.twitchtv.v5+json",
                "Client-ID": clientID
            }
        }
        this.badgeDivArray=[]
        this.subscriberBadges={}
        this.globalBadges={}
        this.channelBadges={}
        this.counter=1
        this.arrayOfCombinedEmotes=[]
        this.emotes = []
        this.emoteSets= []
        this.combinedEmotes=[]
        this.modDiv = null
        this.myDivs = []
        this.myReturn = this.myDivs.slice(0);
        this.modalClass = "hide-modal"
        this.modStatus = null;
        this.badgeClass = "is-mod"
        this.modUnmod = null;

        // this.options = {
        //     options: {
        //         debug: true
        //     },
        //     connection: {
        //         reconnect: true
        //     },
        //     identity: {
        //         username: "streampanelapp",
        //         password: "oauth:"+this.props.oauth
        //     },
        //     channels: [streamer]
        // };
        
        // this.props.client = new tmi.client(this.options);
        
      
            
        // this.props.client.connect();
        this.state = {
            globalBadges:{},
            modStatus: null,
            message: "",
            userName: "",
            color: "",
            modal: false,
            badges: {},
            post:"",
            myDivs:[]
            
            
            }
        

    }
    
    
    
    fetchEmotes(){
        let emoteSetString=""
        
        // if(this.props.partner){
            if(true){
            axios.get(`https://api.twitch.tv/api/channels/${streamer}/product`,this.headers).then(data=>{
                // console.log("MY EMOTE SETS", data.data.plans[data.data.plans.length-1].emoticon_set_ids)
                // console.log("MY EMOTE SETS", data.data.plans)
                //ie 1332,44224,54443
                // let makeSetsStrings = ","+data.data.plans[data.data.plans.length-1].emoticon_set_ids.join(",")
                let makeSetsStrings = ","+data.data.plans[data.data.plans.length-1].emoticon_set_ids[0]
                this.emoteSets.push(data.data.plans[data.data.plans.length-1].emoticon_set_ids[0])
                this.emoteSets.push(0)
                // console.log("HYPED HYPED ", this.emoteSets)
                emoteSetString+=","+makeSetsStrings
                //make array of emotesets
                
                
                // console.log("EMOTESET STRING IN LOOP", emoteSetString)
                const myURL = `https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0${makeSetsStrings}`
        // console.log("MY EMOTESET BRRRRRRRRRR",myURL, )
        axios.get(myURL,this.headers).then(resp=>{
            
                for(let i=0;i<this.emoteSets.length;i++){
                    // console.log("MY EMOTESET CLOSE",resp.data.emoticon_sets[this.emoteSets[i]])
                    // console.log("MY EMOTESET CLOSE",resp.data.emoticon_sets[this.emoteSets[i]])
                    this.arrayOfCombinedEmotes.push(...resp.data.emoticon_sets[this.emoteSets[i]])
                    // console.log("GRRRRRRRRRRRR", this.arrayOfCombinedEmotes)
                }
                // console.log("GRRRRRRRRRRRR", )
                this.emotes= this.arrayOfCombinedEmotes
                // console.log("MY EMOTE DATA RIGHT NOW:", this.emotes)
                
        })
                })
        }}
    // } else {
    //         emoteSetString=""
    //         const myURL = `https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0${emoteSetString}`
    //     console.log("MY EMOTESET URL",myURL)
    //     axios.get(myURL,headers).then(resp=>{
    //         console.log("MY EMOTE DATA RIGHT NOW:", resp.data)
    //             for(let i=0;i<resp.data.emoticon_sets.length;i++){
    //                 this.combinedEmotes.push(resp.data.emoticon_sets[this.emoteSets[i].id])
    //             }
            
    //             this.emotes= this.combinedEmotes
    //             console.log("MY EMOTE SET NOT PARTNER: ",this.emotes)
    //             return this.emotes
    //     })
    //     }
        
    // }
    
    smartEmoteParser(text, emotes) {
        if(!emotes || emotes.length === 0) {
            this.setState({
                post: text
            })
        }
        var splitText = text.split('');
        for(var i in emotes) {
            var e = emotes[i];
            for(var j in e) {
                var mote = e[j];
                if(typeof mote == 'string') {
                    let JSXelem= <img key={this.counter+=1} className="emote animated pulse infinite" src={`https://static-cdn.jtvnw.net/emoticons/v1/${i}/2.0`}/>
                    mote = mote.split('-');
                    mote = [parseInt(mote[0]), parseInt(mote[1])];
                    var length =  mote[1] - mote[0],
                        empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
                    splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
                    splitText.splice(mote[0], 1, JSXelem);
                }
            }
        }
        this.setState({
            post:splitText
        })
    }

    // emoteParserSmart(message,user){
    //     let newEmoteOBJ={}
    //     let emoteObj = user.emotes
    //     let arrayOfWords = message.split(" ")
    //     let emoteID=null
    //     let arrayOfEmoteKeys = Object.keys(emoteObj)

    //     //make new emote object with [0-8]:90 format
    //     for (let i=0;i<arrayOfEmoteKeys.length;i++){
    //         for(let i=0;i<emoteObj[arrayOfEmoteKeys[i]].length;i++){
    //             newEmoteOBJ[emoteObj[arrayOfEmoteKeys[i][0]]]=arrayOfEmoteKeys[i]
    //         }
    //     }


    //     let JSXelem= <img className="emote animated pulse infinite" 
    //     src={`https://static-cdn.jtvnw.net/emoticons/v1/${emoteID}/2.0`}/>



    // }

    // emoteParser(message){
        
    //     this.setState({
    //         post: message
    //     })
    //     console.log("MY AXIOS EMOTES ", this.emotes)
    //     let arrayOfWords = message.split(" ")
    //     for(let i=0;i<arrayOfWords.length;i++){
    //         for(let k=0; k<this.emotes.length; k++){
    //             // console.log(this.emotes[k])
    //             if(arrayOfWords[i]===this.emotes[k].code){
    //                 let JSXelem= <img className="emote animated pulse infinite" src={`https://static-cdn.jtvnw.net/emoticons/v1/${this.emotes[k].id}/2.0`}/>
                    
    //                 arrayOfWords.splice(i,1,JSXelem)
    //                 let parsedMessage = <div>{arrayOfWords}</div>
    //                 this.setState({
    //                     post : parsedMessage
    //                 })
    //                 console.log("Found EMOTE match: ",this.emotes[k].code, this.state.post)
                    
    //             }
                
    //         }
    //     } 
    
    // }
        
        
            
            
            
            
     
        
        
    getModStatus = (user)=>{
        this.props.client.mods("streampanelapp").then(data =>{
            if(data.includes(user.username)){
                this.modStatus=true
            }else{
                this.modStatus=false
            }
    })
    }

    makeMessageDivs=(channel,user,message,self,badgeArray)=>{
        
        
        this.myDivs.push(
        <Modal key={this.counter+=1} className="black"
            trigger={<div className="chat-card" key={this.counter+=1} onClick={()=>{}}>
                <div className="message-intro-box">
                    <div className="message-intro">
                    <div className="badges">{this.badgeDivArray}</div>
                    <div className="chat-name" style={{color:user.color}}>{user.username}</div>
                    </div>
                    
                </div>
                
                
                <div className="chat-message" key={this.counter+=1}>: {this.state.post}</div>
            </div>}>
                <header>{ (user.username).toUpperCase()}</header>
                <div className="modal-btn-box">
                <div className="btn purple" onClick={()=>{
                        this.props.client.action("streampanelapp", `Hola, ${user.username}`)
                        .then(function(data) {
                            
                            }).catch(function(err) {
                            
                                });
                    }}>Message</div>
                
                <div className="btn blue" onClick={()=>{
                            
                            this.props.client.unmod("streampanelapp", user.username).then(function(data) {
                                // data returns [channel, username]
                                // console.log(data)
                            }).catch(function(err) {
                                //
                                // console.log(err)
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
        this.setState({
            myDivs: this.myDivs
        })
        if(this.myDivs.length > 30) {
            this.myDivs.shift()
        }
        
        if(document.getElementById('chat-section')){
            let chatSec = document.getElementById('chat-section');
            chatSec.scrollTop = chatSec.scrollHeight;
        }
        
        // $('#chat-section').animate({ scrollTop: "+="+chatSec.scrollHeight }, "slow");
    }
    

getGlobalBadges=()=>{
    axios.get("https://badges.twitch.tv/v1/badges/global/display?language=en").then(data=>{
                let myOBJ = data
                this.globalBadges=myOBJ.data.badge_sets
                
                // console.log("Global BADGES DATA:",this.globalBadges)
            })

}
getSubscriberBadges=()=>{
    axios.get("https://badges.twitch.tv/v1/badges/channels/"+streamerID+"/display?language=en").then(data=>{
        let myOBJ = data
        this.subscriberBadges=myOBJ.data.badge_sets
    })
}
getChannelBadges=()=>{
    axios.get(`https://api.twitch.tv/kraken/chat/${streamerID}/badges`,this.headers)
    .then(data=>{
                let myOBJ=data
                this.channelBadges=myOBJ.data
                
                // console.log("Channel BADGES DATA:",this.channelBadges)
            })

}
makeBadgeDivs=(user)=>{
    this.badgeDivArray=[]
    if(!user.badges){
        return
    } else {
        
        let arr = Object.keys(user.badges)
        // console.log(arr)
        // console.log(this.globalBadges)
        for(let i=0; i<arr.length;i++){
            if(arr[i]==="moderator"){
                let myURL = this.channelBadges.mod.image
                // console.log("my mod object",this.channelBadges.mod.image)
                this.badgeDivArray.push(<img className="badge" src={myURL} />)
            }else if(arr[i]==="subscriber"){
                let myURL = this.subscriberBadges[arr[i]].versions[user.badges[arr[i]]].image_url_4x
                // console.log(myURL)
                this.badgeDivArray.push(<img key={this.counter+=1} className="badge" src={myURL} />)
            }
            else if(this.channelBadges[arr[i]]){
                let myURL = this.channelBadges[arr[i]].image
                this.badgeDivArray.push(<img className="badge" src={myURL} />)
            }
            else if(this.globalBadges[arr[i]]){
                // console.log("THIS IS MY UNDEFINED",this.globalBadges[arr[i]].versions[user.badges[arr[i]]])
                let myURL = this.globalBadges[arr[i]].versions[user.badges[arr[i]]].image_url_4x
                // console.log(myURL)
                this.badgeDivArray.push(<img key={this.counter+=1} className="badge" src={myURL} />)
                // console.log("I HAVE A BADGE AND IT IS GLOBAL BADGE: ",arr[i])
            }
        }
    }
}
        
    componentDidMount(){
        this.getGlobalBadges()
        this.getChannelBadges()
        this.getSubscriberBadges()
        
        // this.fetchEmotes()
        
        this.props.client.on('chat', (channel, user, message, self)=>{
            // console.log("MY ENTIRE EMOTES OBJ:",user.badges)
            this.makeBadgeDivs(user)
            
            
            
            // this.emoteParser(message,)
            this.smartEmoteParser(message,user.emotes)
            this.makeMessageDivs(channel,user,message,self)
            
            
            if(message==="hola"){
                this.props.client.action("streampanelapp", "Your test message, hola").then(function(data) {
                    // data returns [channel]
                }).catch(function(err) {
                    //
                });
            }
            
        

            
        })}

    render(){
        
        
        return (
            this.state.myDivs
            
       )
            
        
    }
}