import React, { Component } from 'react';
import MainSection from '../src/sections/mainsection'
import ChatSection from '../src/sections/chatsection'
// import getScenes from './sections/obsscenes'
import './App.css';

class App extends Component {
  render() {
    // getScenes();
    return (
      <div className="App">
        <MainSection/>
        <ChatSection/>
      </div>
    );
  }
}

export default App;
