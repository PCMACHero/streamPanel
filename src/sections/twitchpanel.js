import React from 'react';
import "./twitchpanel.css"
// import SceneBtn from './scenebtn'
// import {twitchBtns} from '../helpers/dummydata'

const twitchPanel = (props)=> {
        
    
        return (<div className='source-panel'>

            <div className="twitch-btn"  onClick={()=>{props.runAd()}}>
                <i className="material-icons">
                monetization_on
                </i>
                <div className='label'>RUN AD</div>
            </div>
            <div className="twitch-btn"  onClick={()=>{console.log(" clicked")}}>
                <i className="material-icons">
                adb
                </i>
                <div className='label'>COMMANDS</div>
            </div>
            <div className="twitch-btn"  onClick={()=>{console.log(" clicked")}}>
                <i className="material-icons">
                chat
                </i>
                <div className='label'>CHAT-MODE</div>
            </div>
        
    </div>)
    
    
}
export default twitchPanel