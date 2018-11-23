import React, {Component} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';

class MainSection extends Component{
    
    state = {scenes: 
            [ { name: 'Starting Soon', sources: [Array] },
              { name: 'Main', sources: [Array] },
              { name: 'Pre-Game Lobby', sources: [Array] },
              { name: 'Parachute', sources: [Array] },
              { name: 'BRB', sources: [Array]},
              { name: 'In-Game', sources: [] } ]
           }
    
           componentDidMount(){
            let obj = {};
    
            const server = new Obs();
            console.log(server);
            server.addMessageListener( this.handleServerEvent.bind(this));
            server.connect().then((responseHandler)=>{
                server.send({'request-type': 'GetSceneList'}).then(data=>{
                    this.setState( { scenes: data.scenes } );
    
                });
                server.send({'request-type': 'GetMute', source: 'newsub'})
            })};
    
    


           
    handleServerEvent(newEventData){
        console.log("EVENT FIRED", newEventData);
    }
    render(){
        return <div className='main-section'>
        <ScenePanel arr={this.state}/>
    <div className="mid-section"><SourcePanel />
        <VideoBox channel={streamer}></VideoBox></div>
        </div>
    }
}
export default MainSection