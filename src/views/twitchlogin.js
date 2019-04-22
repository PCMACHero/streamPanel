import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import {clientID} from '../common/common'
// import getScenes from './sections/obsscenes'
import './twitchlogin.css';
import SVGLogo from '../sections/svg';
import InfoPane from '../sections/infoPane';
import Features from '../sections/features'




class twitchLogin extends Component{



  state={
    interval: null,
    twitchURL:null,
    lineDiv:<div key={this.counter}className="nice-line animated fadeIn">WELCOME TO STREAMPANEL APP</div>,
    info: {
      body1: ""
    }
  }
  

  



  info = {
    b1: "Mute your mics, switch scenes, start / stop stream, and much much more, without having to stop the action.",
    b2: "Monitor your chat and stream video, moderate users, update your stream title and category, run ads, view new follows and subs, and much more.",
    b3: "Create your own bot commands with ease. Just create a command name, and what you want the response to be, and it will respond when activated in chat.",
    b4: "Use any device on your network to control your streaming computer. Tablets, laptops, anything with a browser."
  }
  features = ["Change Scenes", "Mute Mics", "Toggle Sources", "Start/Stop Stream", "Monitor OBS Status", "View Chat", "Ban / Timeout", "Mod Users", "Create Bot Commands", "Run Ads", "Chat-Mode (slow, subs, etc)", "Change Game / Category", "Update Stream Title", "See Recent Foll/Subs", "MUCH MORE to come"]
  counter=0
lineCounter = 0
lines=["All-in-one soution for Twitch Streaming", "Control OBS and Twitch from one place", "Many features already included, and many more planned.", "Works on any device on your network", "Use your tablet, laptop or desktop", "Easy to use, clean, and fast to get started"]
// URL = `https://id.twitch.tv/oauth2/authorize?client_id=${
// clientID}&redirect_uri=http://192.168.2.2:3000/panel&response_type=token&scope=channel_editor+channel_read+chat:read+chat:edit+user:edit+communities_moderate+channel:moderate`
URL = ""

getTwitchLink=()=>{
  console.log("twitch link 1")
  axios.post("/api/getresponsestring").then(data=>{
    if(data.data.message==="Success"){
      this.setState({
        twitchURL:data.data.responseString
      })
      this.URL = data.data.responseString
      console.log("linky",data)
    }
    
  })
}

niceThings=()=>{
  if(this.lineCounter===this.lines.length){
    this.lineCounter=0
  }

  this.setState({
    lineDiv: <div key={this.counter}className="nice-line animated fadeIn">{this.lines[this.lineCounter].toUpperCase()}</div>
  })
  this.lineCounter++
  this.counter++
}

componentWillUnmount(){
  clearInterval(this.state.interval)
}

componentDidMount(){
  console.log("QQQQ", this.data)
  this.getTwitchLink()
  let interval = setInterval(this.niceThings, 3000)
  this.setState({interval:interval})
  
}
render(){
  return (
    <div className="fp">


      {/* <nav>
  <div className="nav-wrapper">
  <div className="brand-logo left"><div className="name-and-logo right"><div id="sp">STREAMPANEL</div>
  <div className="brand-img"></div></div></div>
    
    <ul id="nav-mobile" className="left ">
    
      <li><Link to="/">HOME</Link></li>
      <li><Link to="/setup">SETUP</Link></li>
      <li><Link to="/about">ABOUT</Link></li>
      
    </ul>
  </div>
</nav> */}
<div className="navbar-fixed">
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
</div>
  


      <div className="login-container">
          
           
      <div className="page-space-video">
      <div className="login-cont-cont">
          <div className="login-box-container animated fadeIn">
             <div id="login-box ">
                
              {/* <div className="login-text">Welcome to Streampanel</div>
              <div className="login-text">Lets get started</div> */}
              {this.state.lineDiv}
              
              
              
              </div>
              <div className="center">
              <a className="twitch-btn-login" href= {this.state.twitchURL} style={{height:"100%"}}><div className="login">{this.props.auth? `Welcome, ${this.props.context.state.displayName}`: "Login"}</div></a>
              </div>
          </div>
          

          </div>
          {/* <div className="vid-container"> */}
            <video autoPlay muted loop id="my-video"  height="100%" width="100%">
            <source src="/videos/spmov.mov" type="video/mp4"/>
        </video>
          {/* </div> */}
        
      </div>
          
          
          
      </div>

      <div className="page-space">
      
        <div className="page-section">
        <InfoPane title="OBS CONTROL" body={this.info.b1} icon={<i className="material-icons">
mic
</i>} icon2= {<i className="material-icons">
videocam
</i>}/>
        <div className="fp-img-box"><div className="fp-img" style={{backgroundImage:`url(../images/fp-1.jpg)`}}></div></div>
        
        </div>
        
       
      </div>
      <div className="page-space">
      <div className="page-section">
        
        <InfoPane title="TWITCH CONTROL" body={this.info.b2} icon={<i className="material-icons">
mic
</i>} icon2= {<i className="material-icons">
videocam
</i>}/>
<div className="fp-img-box"><div className="fp-img" style={{backgroundImage:`url(../images/twitch.png)`}}></div></div>
        
        </div>
      </div>
      <div className="page-space">
       <InfoPane title="BOT COMMANDS" body={this.info.b3} icon={<i className="material-icons">
adb
</i>}/>
       <div className="fp-img-box"><div className="fp-img" style={{backgroundImage:`url(../images/commands.png)`}}></div></div>

      </div>
      <div className="page-space" style={{backgroundImage:`url(../images/spbg2.jpg)`, backgroundSize:"cover",backgroundColor:"rgba(69, 0, 130, 0.8)", backgroundPosition: "center", backgroundBlendMode: "screen", color:"black"}}>
       <InfoPane color="#131215de" title="CONTROL WIRELESSLY" body={this.info.b4} icon={<i className="material-icons">
tablet_mac
</i>} icon2={<i className="material-icons">
wifi
</i>}/>
      </div>
      <div className="login-container2">
      <Features array={this.features} title="OBS FEATURES"/>
        <video autoPlay muted loop id="my-video" height="100%" >
          <source src="/videos/spmov.mp4" type="video/mp4"/>
        </video>
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

}


    

export default twitchLogin;