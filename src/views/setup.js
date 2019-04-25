import React from 'react';
import {Link} from 'react-router-dom';
import "./setup.css"

const setup = ()=>{
    return (
        <div className="App">
        <nav>
    <div className="nav-wrapper">
    
      <a href="#" className="brand-logo right"><div className="sp">StreamPanel</div><div className="brand-img"></div></a>
      <ul id="nav-mobile" className="left ">
      <li><Link to="/">HOME</Link></li>
      <li><Link to="/setup">SETUP</Link></li>
      <li><Link to="/about">ABOUT</Link></li>
      </ul>
    </div>
  </nav>
        <div className="login-container2">

             
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
        <footer className="page-footer purple darken-4">
          <div className="container ">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">Follow Us On Twitter</h5>
                <p className="grey-text text-lighten-4">Keep up with new updates, and announcements. We are always looking at feedback as well.</p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">Links</h5>
                <ul>
                  <li><a className="grey-text text-lighten-3" href="https://twitter.com/stream_panel" target="_blank">Twitter</a></li>
                  <li><a className="grey-text text-lighten-3" href="mailto:streampanelapp@gmail.com" target="_blank">Contact</a></li>
                  <li><a className="grey-text text-lighten-3" href="https://youtube.com" target="_blank">Youtube</a></li>
                  
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            © 2019, StreamPanel
            {/* <a className="grey-text text-lighten-4 right" href="#!">More Links</a> */}
            </div>
          </div>
        </footer>
      </div>
        
    );
    

}

export default setup
