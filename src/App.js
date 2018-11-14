import React, { Component } from 'react';
import MainSection from '../src/sections/mainsection'
import ChatSection from '../src/sections/chatsection'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainSection/>
        <ChatSection/>
      </div>
    );
  }
}

export default App;
