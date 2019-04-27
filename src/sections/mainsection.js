import React, {Component, Fragment} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
// import tmi from "tmi.js";
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';
import BottomPanel from "./bottompanel";
import TwitchPanel from "./twitchpanel"
import Chat from "./chatsection"
import axios from 'axios'
import { clientID } from '../common/common';
import {MyContext} from "../helpers/provider"
// import {Modal, Button, Icon} from "react-materialize"

class MainSection extends Component{
    
    srcClass = null;
    
    client = null
    messageList = {};
    ad = false;
    
    state = {
        displayName: this.props.context.state.displayName,
        client:null,
        // sceneComp:null,
        channel:{
            
            // game:null,
            // status:null,
            // userID:null,
            // partner:null,
            // name: null,
            // email: null,
            // mature: null,
            // views: null,

        },
        event:null,
        statusMessage:null,
        streamingStatus: null,
        currentScene: "",
        scenes: [],
        sources: [{
            name: "mic",
            render: true,
            typeId: "av_capture_input"
        }],
        micSources: {"message-id": "6", muted: false, name: "bb", status: "ok"}
        // bottomDiv: null,

    }
    
       
        
    
    // options = {
    //         options: {
    //             debug: true
    //         },
    //         connection: {
    //             reconnect: true
    //         },
    //         identity: {
    //             username: "streampanelapp",
    //             password: "oauth:"+this.props.context.state.myOauth
    //         },
    //         channels: [streamer]
    //     };
    // client = new tmi.client(this.options);
    
    
    
    // disableAC=()=>{
    //     $(".autocomplete").attr({
    //         "autocomplete":"off"
    //     })
    // }
// need username, userID, game, status, live status, viewers, followers,
    getUserID=(id, oauth)=>{
        const headers = {"headers":{
            "Client-ID": id,
            "Authorization": 'OAuth '+oauth
        }}
         axios.get("https://api.twitch.tv/kraken/channel",headers).then(data=>{
            console.log("THIS IS MY USERID AXIOS DATA: ",data.data)
            
            
            this.setState({
                channel: {
                    statusFunc: this.getUserID,
                    oauth: this.props.context.state.myOauth,
                    game: data.data.game,
                    status: data.data.status,
                    userID: data.data["_id"],
                    partner:data.data.partner,
                    name: data.data.name,
                    email: data.data.email,
                    mature: data.data.mature,
                    views: data.data.views,
                    streamKey: data.data.stream_key

                },
                
                
                
            })
            console.log("THIS IS MY USERID AXIOS DATA2: ",this.state.channel.userID)
            console.log("MY CHAN OBJ", this.state.channel)
        })
    }
   
    

  
    // listener = (handler)=>{
    //     this.props.server.addMessageListener(handler)
    // }


           
    // childHandler=(e, callback)=>{
    //     callback(e)
    // }  

    handleServerEvent=(newEventData)=>{
        // this.childHandler(newEventData,)
        
        console.log("EVENT FIRED 9", newEventData);
        
        this.props.context.updateState("event", newEventData)
        
        this.setState({
            event: newEventData
        })
        
        
    }
           
            
          componentDidUpdate(pp){
              console.log("CRAP", pp)
              console.log("CRAP2", this.props.context)
            if(pp.client===null && this.props.context.state.client){
                this.client.connect();
                // this.props.server.connect()
                
            }
            

            

            if(this.props.server && pp.server===null){
                
                this.props.server.addMessageListener(this.handleServerEvent)
            }
          }
           componentDidMount(){
               console.log("MAIN HAS MOUNTED", this.props.context)
           
            };

            
    
    


           
    
    render(){
        // console.log("RERENDERED MAINSECTION")
        return (
            <MyContext.Consumer>
    {context =>
            <Fragment>
            <div className='main-section'>
            <div className="cover"><div className="brand"><div className="brand-user">{context.state.displayName}</div><div className="powered">  powered by  </div><div className="brand-title"> STREAMPANEL APP</div></div></div>
            <ScenePanel server={context.state.OBSServer}  event={this.state.event} scenes={this.state.scenes} func={this.setSceneAndSourcesOnClick} context={context} currentScene={this.state.currentScene}/>
            <div className="mid-section">
                <SourcePanel server={context.state.OBSServer}  event={this.state.event} showHide={context.showHideScreen} func={this.toggleSource} srcClass={this.state.srcClass} />
                <VideoBox channel={this.props.context.state.displayName}></VideoBox>
                <TwitchPanel client={context.state.client} oauth={this.props.oauth} newMessage={context.newMessage} context={context} runAd={this.runAd}/>
                
            </div>
            
            <BottomPanel event={this.state.event} server={context.state.OBSServer} channelOBJ={this.state.channel} client={this.client} OBSOBJ={this.state} oauth={this.props.oauth} micSources={this.state.micSources} context={context}/>
            
        </div> 
            
            <Chat-Section id="chat-section">
            
      
                <Chat client={context.state.client} chanBadges={this.props.chanBadges} partner={context.state.partner} 
                context={context} />
            </Chat-Section> 
            </Fragment>
            }
            </MyContext.Consumer>
            
        )
        
        
    }
}
export default MainSection