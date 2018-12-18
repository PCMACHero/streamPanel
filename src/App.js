import React, { Component } from 'react';
import StreamPanel from './views/streampanel'
import TwitchLogin from './views/twitchlogin'
import Success from './views/success'
import {BrowserRouter, Route} from 'react-router-dom'
import './App.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/success" component={Success} exact/>
          <Route path="/login" component={TwitchLogin}/>
          <Route path="/panel" component={StreamPanel}/>
        </div>
          
        
      </BrowserRouter>
      
    );
  }
}

export default App;
