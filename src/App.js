import React, { Component } from 'react';
import StreamPanel from './views/streampanel'
import TwitchLogin from './views/twitchlogin'
import Success from './views/success'
import about from './views/about'
import setup from './views/setup'
import {BrowserRouter, Route} from 'react-router-dom'
import './App.css';


class App extends Component {




  render() {
    return (
      <BrowserRouter 
      // forceRefresh="true"
      >
        <div>
          <Route path="/success" component={Success} exact/>
          <Route path="/login" exact component={TwitchLogin}/>
          <Route path="/" exact component={StreamPanel}/>

          <Route path="/panel" component={StreamPanel}/>
          <Route path="/about" component={about}/>
          <Route path="/setup" component={setup}/>
        </div>
          
        
      </BrowserRouter>
      
    );
  }
}

export default App;
