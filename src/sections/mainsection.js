import React, {Component} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';
import { setTimeout } from 'timers';
// import {Modal, Button, Icon} from "react-materialize"

class MainSection extends Component{
    srcClass = null;
    server = new Obs();
    
    state = {
        currentScene: "",
        scenes: [],
        sources: [{
            name: "mic",
            render: true,
            typeId: "av_capture_input"
        }],
        


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
            
            };
    
    


           
    handleServerEvent(newEventData){
        // console.log("EVENT FIRED", newEventData);
        
        
        
    }
    render(){
        return <div className='main-section'>
        <ScenePanel scenes={this.state.scenes} func={this.setSceneAndSourcesOnClick} currentScene={this.state.currentScene}/>
        <div className="mid-section">
            <SourcePanel sources={this.state.sources} func={this.toggleSource} srcClass={this.state.srcClass} />
            <VideoBox channel={streamer}></VideoBox>
            
            </div>
        </div>
    }
}
export default MainSection