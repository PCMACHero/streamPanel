import React from 'react';
import MainSection from '../sections/mainsection'
import ChatSection from '../sections/chatsection'
import TwitchList from '../sections/twitchoauth'
import {clientID} from '../common/common'
// import getScenes from './sections/obsscenes'
import './login.css';

let URL = `https://id.twitch.tv/oauth2/authorize?client_id=${
clientID}&redirect_uri=
http://localhost:3000/success&response_type=token&scope=
channel_editor+channel_read+chat:read+chat:edit`
const twitchLogin = ()=> {
  
    return (
      <div className="App">
        <div className="login-container">
            <div className="nav">
                <div className="nav-btn">Sign-Up</div>
                <div className="nav-btn">About</div>
                <div className="nav-btn">Setup</div>
            </div>
            <div id="login-box">
                <div className="login-text">Log In To Begin</div>
                <a className="twitch-btn" href= {URL}>LOGIN</a>

            </div>
        </div>
      </div>
        
    );
  
}

export default twitchLogin;