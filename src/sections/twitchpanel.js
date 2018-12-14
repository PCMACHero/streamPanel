import React from 'react';
import "./twitchpanel.css"
import {streamer} from "../helpers/dummydata"
import tmi from "tmi.js";
import {Modal} from 'react-materialize'
import Commands from './commands'
// import SceneBtn from './scenebtn'
// import {twitchBtns} from '../helpers/dummydata'

const twitchPanel = (props)=> {
    const options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: "streampanelapp",
            password: "oauth:"+props.oauth
        },
        channels: [streamer]
    };
    const client = new tmi.client(options);
    client.connect();
        
     
        const runAd=()=>{
            
            
            
            client.commercial(streamer, 30).then(function(data) {
                // data returns [channel, seconds]
            }).catch(function(err) {
                //
                console.log(err)
            });
            
        }
    
        return (<div className='source-panel'>

            <div className="twitch-btn"  onClick={()=>{runAd()}}>
                <i className="material-icons">
                monetization_on
                </i>
                <div className='label'>RUN AD</div>
            </div>
            <Modal className="commands-modal"
                header='COMMAND CREATOR'
                trigger={<div className="twitch-btn"  onClick={()=>{console.log(" clicked")}}>
                <i className="material-icons">
                adb
                </i>
                <div className='label'>COMMANDS</div>
            </div>}>
                <Commands/>
                </Modal>
            
            <div className="twitch-btn"  onClick={()=>{console.log(" clicked")}}>
                <i className="material-icons">
                chat
                </i>
                <div className='label'>CHAT-MODE</div>
            </div>
        
    </div>)
    
    
}
export default twitchPanel