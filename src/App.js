import React, { Component } from 'react';
import StreamPanel, {MyProvider} from './views/streampanel'

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
      <MyProvider>
      <div>
          <Route path="/success" component={Success} exact/>
          <Route path="/" exact component={TwitchLogin}/>
          <Route path="/panel" exact component={StreamPanel}/>

          
          <Route path="/about" component={about}/>
          <Route path="/setup" component={setup}/>
        </div>
        </MyProvider>
        
          
        
      </BrowserRouter>
      
    );
  }
}

export default App;
