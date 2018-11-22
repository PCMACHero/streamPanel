import React, { Component } from 'react';
import MainSection from '../sections/mainsection'
import ChatSection from '../sections/chatsection'
// import getScenes from './sections/obsscenes'
import '../App.css';

class StreamPanel extends Component {
  render() {
    return (
      <div className="App">
        <MainSection/>
        <ChatSection/>
      </div>
    );
  }
}

export default StreamPanel;