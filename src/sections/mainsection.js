import React, {Component} from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"
import Obs from '../helpers/obs-server.js';

class MainSection extends Component{
    componentDidMount(){
        // var huh = obs.connect({
        //     address: "localhost:4444"
        // });
        const server = new Obs();
        console.log(server);
        server.addMessageListener( this.handleServerEvent.bind(this));
        server.connect().then(function(responseHandler){
            server.send({'request-type': 'GetSceneList'});
            server.send({'request-type': 'GetMute', source: 'newsub'})

        });
    }
    handleServerEvent(newEventData){
        console.log("EVENT FIRED", newEventData);
    }
    render(){
        return <div className='main-section'>
        <ScenePanel/>
    <div className="mid-section"><SourcePanel/>
        <VideoBox channel={streamer}></VideoBox></div>
        </div>
    }
}
export default MainSection