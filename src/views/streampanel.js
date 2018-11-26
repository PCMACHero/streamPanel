import React, { Component } from 'react';
import MainSection from '../sections/mainsection'
import ChatSection from '../sections/chatsection'
// import getScenes from './sections/obsscenes'
import '../App.css';

class StreamPanel extends Component {
    state = {
        token: ""
    }

    componentDidMount(){
        let hash = this.props.location.hash;
        let accessToken = hash.slice(13,44)
        

        console.log("LOCATION DATA:----------->",accessToken)
    }
    
  render() {
    return (
      <div className="App">
        <MainSection/>
        <ChatSection />
      </div>
    );
  }
}

export default StreamPanel;