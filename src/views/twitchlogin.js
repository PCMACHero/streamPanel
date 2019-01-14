import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {clientID} from '../common/common'
// import getScenes from './sections/obsscenes'
import './twitchlogin.css';


class twitchLogin extends Component{


  state={
    lineDiv:<div key={this.counter}className="nice-line animated fadeInDown">Welcome to StreamPanel App</div>
  }
  counter=0
lineCounter = 0
lines=["All-in-one soution for Twitch Streaming", "Control OBS and Twitch from one place", "Feature rich, and more to come", "Works on any device on your network", "Use your tablet, laptop or desktop", "Easy to use, clean, and fast to get started"]
URL = `https://id.twitch.tv/oauth2/authorize?client_id=${
clientID}&redirect_uri=http://localhost:3000/panel&response_type=token&scope=channel_editor+channel_read+chat:read+chat:edit+user:edit+communities_moderate+channel:moderate`

niceThings=()=>{
  if(this.lineCounter===this.lines.length){
    this.lineCounter=0
  }

  this.setState({
    lineDiv: <div key={this.counter}className="nice-line animated fadeInDown">{this.lines[this.lineCounter]}</div>
  })
  this.lineCounter++
  this.counter++
}
componentDidMount(){
  setInterval(() => {
    this.niceThings()
  }, 4000);
  
}
render(){
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
  <div className="brand-logo left">StreamPanel App</div>
    {/* <a href="#" class="brand-logo ">StreamPanel.app</a> */}
    <ul id="nav-mobile" className="right hide-on-small">
    
      <li><Link to="/">Home</Link></li>
      <li><Link to="/setup">Setup</Link></li>
      <li><Link to="/about">About</Link></li>
      
    </ul>
  </div>
</nav>

          
          <div className="login-box-container animated fadeIn">
          <div id="login-box ">
              {/* <div className="login-text">Welcome to Streampanel</div>
              <div className="login-text">Lets get started</div> */}
              {this.state.lineDiv}
              <a className="twitch-btn" href= {this.URL}><div className="login">Login</div></a>
              
          </div>
          
          </div>
          
      </div>
    </div>
      
  );

}

}


    

export default twitchLogin;