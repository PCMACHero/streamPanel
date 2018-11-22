import React, { Component } from 'react';
import StreamPanel from './views/streampanel'
import TwitchLogin from './views/twitchlogin'
import {BrowserRouter, Route} from 'react-router-dom'
import './App.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/success" component={StreamPanel} exact/>
          <Route path="/login" component={TwitchLogin}/>
        </div>
      </BrowserRouter>
      
    );
  }
}

export default App;
