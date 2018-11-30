import React, {Component} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';
// import {Modal, Button, Icon} from "react-materialize"

class MainSection extends Component{
    srcClass = null;
    server = new Obs();
    
    state = {
        scenes: [],
        sources: [],
        


           }
           SetSceneItemProperties = (source)=>{
            
               this.server.send({'request-type': 'GetCurrentScene'}).then(data=>{
                   console.log("SCENE SOURCES: ", data.sources)
                   for(let i = 0; i < data.sources.length; i++){
                       
                       if (data.sources[i].name === source){
                           console.log("MATCH FOUND",data.sources[i].name, source)
                           let toggle = !data.sources[i].render
                           console.log("toggle is now ",toggle)
                           this.server.send({'request-type': 'SetSceneItemProperties',"item": source, "visible": toggle})
                           
                           
                           
                       } 
                   }
                   this.componentDidMount()
               })

            //    console.log("CLIECKED ROUCES :", source)
            //    this.server.send({'request-type': 'GetSourceSettings',"sourceName": source}).then(data=>{
            //        console.log("SDJKDFJKDJGKJGKJGFKG",data)
            //    })
            
            

           }
           setScene=(scene)=>{
            this.server.send({'request-type': 'SetCurrentScene', "scene-name": scene})
            this.server.send({'request-type': 'GetCurrentScene', "scene-name": scene}).then(data2=>{
                this.setState( { 
                    sources: data2.sources
                } );
                console.log("LOOKING FOR CURRENT SCENE SOURCES:", data2.sources)
            })
            this.server.send({'request-type': 'GetSceneList'}).then(data=>{
                console.log("LOOKING FOR CURRENT:", data["current-scene"])
                this.setState( { 
                    scenes: data.scenes,
                    currentScene:data["current-scene"] 
                } );

            })
           }
           componentDidMount(){
            
            console.log(this.server);
            
            this.server.addMessageListener( this.handleServerEvent.bind(this));
            
            this.server.connect().then((responseHandler)=>{
                this.server.send({'request-type': 'GetSceneList'}).then(data=>{
                    console.log("LOOKING FOR CURRENT:", data)
                    this.setState( { 
                        scenes: data.scenes,
                        currentScene:data["current-scene"] 
                    } );
    
                });
                
                this.server.send({'request-type': 'GetCurrentScene'}).then(data2=>{
                    console.log("SOURCES ON LOAD", data2.sources)
                    this.setState( { 
                        sources: data2.sources
                    } )});


                this.server.send({'request-type': 'GetMute', source: 'newsub'})
                this.server.send({'request-type': 'ToggleMute', source: "Browser"})
                
                
            })};
    
    


           
    handleServerEvent(newEventData){
        console.log("EVENT FIRED", newEventData);
        
        
        
    }
    render(){
        return <div className='main-section'>
        <ScenePanel arr={this.state} func={this.setScene} currentScene={this.state.currentScene}/>
        <div className="mid-section">
            <SourcePanel arr2={this.state} srcClass={this.state.srcClass} func={this.SetSceneItemProperties}/>
            <VideoBox channel={streamer}></VideoBox>
            
            </div>
        </div>
    }
}
export default MainSection