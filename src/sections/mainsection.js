import React, {Component, Fragment} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';
import BottomPanel from "./bottompanel";
import TwitchPanel from "./twitchpanel"
import Chat from "./chatsection"
// import {Modal, Button, Icon} from "react-materialize"

class MainSection extends Component{
    srcClass = null;
    server = new Obs();
    messageList = {};
    ad = false;
    
    state = {
        
        statusMessage:null,
        streamStatus: null,
        currentScene: "",
        scenes: [],
        sources: [{
            name: "mic",
            render: true,
            typeId: "av_capture_input"
        }],
        


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
        this.server.send({'request-type': 'StartStopStreaming'}).then(data=>{
            
    })}
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

           
                
                
           connectOBS(){
               
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
                        streamStatus:data.streaming
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
            
            this.getFirstScenesAndSources()
            // this.getStreamingStatus();

            
            };

            
    
    


           
    handleServerEvent(newEventData){
        console.log("EVENT FIRED", newEventData);
        if(newEventData["update-type"]==="SceneItemVisibilityChanged" || newEventData["update-type"]==="SwitchScenes"){
            this.getFirstScenesAndSources()

        }
        if(newEventData["update-type"]==="StreamStopped"){
            this.setState({
                streamStatus: false,
                statusMessage: null,
            })
        }else if ( newEventData["update-type"]==="StreamStopping"){
            this.setState({
                statusMessage: "Stream is stopping..."
            })
        } else if (newEventData["update-type"]==="StreamStarted"){
            this.setState({
                streamStatus: true,
                statusMessage: null
            })
        } else if (newEventData["update-type"]==="StreamStarting"){
            this.setState({
                statusMessage:"Stream is starting..."
            })
        }
        
        
        
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
            
            <BottomPanel func={this.toggleStream} statusMessage={this.state.statusMessage} streamingStatus={this.state.streamStatus}/>
        </div>
            <Chat-Section id="chat-section"><Chat chanBadges={this.props.chanBadges} 
             oauth={this.props.oauth}/></Chat-Section>
            </Fragment>
            
        )
        
        
    }
}
export default MainSection