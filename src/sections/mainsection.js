import React, {Component, Fragment} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';
import BottomPanel from "./bottompanel";
import TwitchPanel from "./twitchpanel"
import Chat from "./chatsection"
import axios from 'axios'
import { clientID } from '../common/common';
// import {Modal, Button, Icon} from "react-materialize"

class MainSection extends Component{
    srcClass = null;
    server = new Obs();
    messageList = {};
    ad = false;
    
    state = {
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
        statusMessage:null,
        streamingStatus: null,
        currentScene: "",
        scenes: [],
        sources: [{
            name: "mic",
            render: true,
            typeId: "av_capture_input"
        }],
        


    }
    // disableAC=()=>{
    //     $(".autocomplete").attr({
    //         "autocoplete":"off"
    //     })
    // }
// need username, userID, game, status, live status, viewers, followers,
    getUserID=()=>{
        const headers = {"headers":{
            "Client-ID": clientID,
            "Authorization": 'OAuth '+this.props.oauth
        }}
         axios.get("https://api.twitch.tv/kraken/channel",headers).then(data=>{
            console.log("THIS IS MY USERID AXIOS DATA: ",data.data)
            
            
            this.setState({
                channel: {
                    statusFunc: this.getUserID,
                    oauth: this.props.oauth,
                    game: data.data.game,
                    status: data.data.status,
                    userID: data.data["_id"],
                    partner:data.data.partner,
                    name: data.data.name,
                    email: data.data.email,
                    mature: data.data.mature,
                    views: data.data.views,
                    streamKey: data.data.stream_key

                }
                
            })
        })
    }
   
    runAd=()=>{
        console.log("clicked run ad part 1")
        this.ad = true;

        
    }
    unrunAd=()=>{
        console.log("clicked unrun ad part 1")
        this.ad = false;

    }

    toggleStream = ()=>{
        console.log("CLICKED TOGGLESTREAM")
        this.server.send({'request-type': 'StartStopStreaming'}).then(data=>{
            console.log("TOGGLESTREAM RESP DATA", data)
    })

}
    toggleSource = (sourceToToggle)=>{
    
        this.server.send({'request-type': 'GetCurrentScene'}).then(data=>{
            console.log("sources before click change", data.sources)
            for(let i = 0; i < data.sources.length; i++){
                
                if (data.sources[i].name === sourceToToggle){
                    
                    let toggle = !data.sources[i].render
                    console.log(toggle)
                    
                    //toggle visibility
                    this.server.send({'request-type': 'SetSceneItemProperties',"item": sourceToToggle, "visible": toggle})
                    
                    
                    
                } 
                
            } this.getFirstScenesAndSources();
            
            
        })

            //    console.log("CLIECKED ROUCES :", source)
            //    this.server.send({'request-type': 'GetSourceSettings',"sourceName": source}).then(data=>{
            //        console.log("SDJKDFJKDJGKJGKJGFKG",data)
            //    })
            
            

           }

           
           
                
           
            
            
           getFirstScenesAndSources(){
            this.server.addMessageListener( this.handleServerEvent.bind(this));
            
            this.server.connect().then((responseHandler)=>{
                this.server.send({'request-type': 'GetSceneList'}).then(data=>{
                    
                    this.setState( { 
                        scenes: data.scenes,
                        currentScene:data["current-scene"] 
                    } );
    
                });
                this.server.send({"request-type": "GetStreamingStatus"}).then(data=>{
                    console.log("MY STREAM STATUS OBJ", data.streaming)
                    this.setState({
                        streamingStatus:data.streaming
                    })
                })

                this.server.send({'request-type': 'GetCurrentScene'}).then(data2=>{
                    
                    this.setState( { 
                        sources: data2.sources
                    } )});


                // this.server.send({'request-type': 'GetMute', source: 'newsub'})
                // this.server.send({'request-type': 'ToggleMute', source: "Browser"})
                
                
            })

           }
           setSceneAndSourcesOnClick=(scene)=>{
            //get new current scene and scene sources
            this.server.send({'request-type': 'SetCurrentScene', "scene-name": scene})
            this.server.send({'request-type': 'GetCurrentScene', "scene-name": scene}).then(data2=>{
               console.log(data2)
               this.setState({
                   currentScene:data2.name,
                   sources: data2.sources
               })
                
            })
            //get new scenes array
            this.server.send({'request-type': 'GetSceneList'}).then(data=>{
                
                this.setState( { 
                    
                    currentScene:data["current-scene"],
                    
                } );

            })
           }
           componentDidMount(){
            //    this.disableAC()
            try{
                this.getFirstScenesAndSources()

            }catch(err){
                console.log(err)
            }
            this.getUserID()
            
            
            

            
            };

            
    
    


           
    handleServerEvent(newEventData){
        
        
        console.log("EVENT FIRED", newEventData);
        if(newEventData["update-type"]==="SceneItemVisibilityChanged" || newEventData["update-type"]==="SwitchScenes"){
            this.getFirstScenesAndSources()

        }
        if(newEventData["update-type"]==="StreamStopped"){
            console.log("REEEEEEEEEEE STOPPED")
            this.setState({
                streamingStatus: false,
                statusMessage: null,
            })
            this.getFirstScenesAndSources()
        }else if ( newEventData["update-type"]==="StreamStopping"){
            this.setState({
                statusMessage: "Stream is stopping..."
            })
            this.getFirstScenesAndSources()
        } else if (newEventData["update-type"]==="StreamStarted"){
            console.log("REEEEEEEEEEE STARTED")
            this.setState({
                streamingStatus: true,
                statusMessage: null
            })
            this.getFirstScenesAndSources()
        } else if (newEventData["update-type"]==="StreamStarting"){
            this.setState({
                statusMessage:"Stream is starting..."
            })
            this.getFirstScenesAndSources()
        }
        console.log("THIS DOESNT CHANGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!",this.state.streamingStatus)
        
        
    }
    render(){
        return (
            <Fragment>
            <div className='main-section'>
            <ScenePanel scenes={this.state.scenes} func={this.setSceneAndSourcesOnClick} currentScene={this.state.currentScene}/>
            <div className="mid-section">
                <SourcePanel sources={this.state.sources} func={this.toggleSource} srcClass={this.state.srcClass} />
                <VideoBox channel={streamer}></VideoBox>
                <TwitchPanel oauth={this.props.oauth} runAd={this.runAd}/>
                
            </div>
            
            <BottomPanel func={this.toggleStream} ChannelOBJ={this.state.channel} OBSOBJ={this.state}/>
            
        </div>
            <Chat-Section id="chat-section"><Chat chanBadges={this.props.chanBadges} 
             oauth={this.props.oauth}/></Chat-Section>
            </Fragment>
            
        )
        
        
    }
}
export default MainSection