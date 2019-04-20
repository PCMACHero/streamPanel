import React from 'react'
import {Link} from 'react-router-dom';
import "./about.css"

const about = ()=>{
    return (
        <div className="App">
        <div className="login-container">

             <nav>
    <div class="nav-wrapper">
    <div className="brand-logo left">StreamPanel App</div>
      {/* <a href="#" class="brand-logo ">StreamPanel.app</a> */}
      <ul id="nav-mobile" className="right hide-on-small">
      
        <li><Link to="/">Home</Link></li>
        <li><Link to="/setup">Setup</Link></li>
        <li><Link to="/about">About</Link></li>
        
      </ul>
    </div>
  </nav>
            <div className="about-us">
            Stream Panel App was created to be an all-in-one solution for streamers. It is in alpha testing as of now, but will constantly be updated and have features added until a public release is viable. Sign up for beta testing!
            </div>

            
        </div>
      </div>
        
    );
    

}

export default about