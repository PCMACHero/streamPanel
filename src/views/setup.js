import React from 'react';
import {Link} from 'react-router-dom';
import "./setup.css"

const setup = ()=>{
    return (
        <div className="App">
        <div className="login-container">

             <nav>
    <div class="nav-wrapper purple darken-3">
    <div className="brand-logo left">StreamPanel App</div>
      {/* <a href="#" class="brand-logo ">StreamPanel.app</a> */}
      <ul id="nav-mobile" className="right hide-on-small">
      
        <li><Link to="/login">Home</Link></li>
        <li><Link to="/setup">Setup</Link></li>
        <li><Link to="/about">About</Link></li>
        
      </ul>
    </div>
  </nav>
            <div className="setup">
            <ol>
                <li>Download <a href="https://github.com/Palakis/obs-websocket/releases">OBS Websocket</a> for your OS 
                    (.pkg/Mac, .exe/Win) </li>
                <li>Install OBS Websocket</li>
                <li>Confirm its installed (check Tools in OBS for "Websocket Server Settings")
                    <div className="center-div"><div className="websocket-gif"></div></div>
                </li>
                <li>Login with your Twitch account on the app</li>
            </ol>
            </div>

            
        </div>
      </div>
        
    );
    

}

export default setup
