import React from 'react';

import {clientID} from '../common/common'
// import getScenes from './sections/obsscenes'
import './login.css';

let URL = `https://id.twitch.tv/oauth2/authorize?client_id=${
clientID}&redirect_uri=
http://localhost:3000/success&response_type=token&scope=
channel_editor+channel_read+chat:read+chat:edit+user:edit+communities_moderate+channel:moderate`
const twitchLogin = ()=> {
  
    return (
      <div className="App">
        <div className="login-container">
            <div className="nav">
                <div className="nav-btn">Sign-Up</div>
                <div className="nav-btn">About</div>
                <div className="nav-btn">Setup</div>
            </div>
            <div className="heading">StreamPanelApp</div>
            <div id="login-box">
                <div className="login-text">Welcome to Streampanel, lets get started</div>
                <a className="twitch-btn" href= {URL}><div className="login">Login</div></a>

            </div>
        </div>
      </div>
        
    );
  
}

export default twitchLogin;