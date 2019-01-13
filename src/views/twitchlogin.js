import React from 'react';

import {clientID} from '../common/common'
// import getScenes from './sections/obsscenes'
import './twitchlogin.css';

let URL = `https://id.twitch.tv/oauth2/authorize?client_id=${
clientID}&redirect_uri=
http://localhost:3000/panel&response_type=token&scope=
channel_editor+channel_read+chat:read+chat:edit+user:edit+communities_moderate+channel:moderate`
const twitchLogin = ()=> {
  
    return (
      <div className="App">
        <div className="login-container">
            {/* <div className="nav">
            
                <div className="nav-btn">Home</div>
                <div className="nav-btn">Setup</div>
                <div className="nav-btn">About</div>
            </div> */}
             <nav>
    <div class="nav-wrapper purple darken-3">
      {/* <a href="#" class="brand-logo ">StreamPanel.app</a> */}
      <ul id="nav-mobile" className=" hide-on-med-and-down">
        <li><a href="sass.html">Home</a></li>
        <li><a href="badges.html">Setup</a></li>
        <li><a href="collapsible.html">About</a></li>
      </ul>
    </div>
  </nav>
            <div className="login-box-container">
            <div id="login-box">
                <div className="login-text">Welcome to Streampanel, lets get started</div>
                <a className="twitch-btn" href= {URL}><div className="login">Login</div></a>

            </div>
            </div>
            
        </div>
      </div>
        
    );
  
}

export default twitchLogin;