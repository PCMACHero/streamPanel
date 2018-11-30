import React, { Component } from 'react';
import MainSection from '../sections/mainsection'
import Chat from '../sections/chatsection'
// import getScenes from './sections/obsscenes'
import '../App.css';

class StreamPanel extends Component {
    
    token = this.props.location.hash.slice(14,44);

    componentDidMount(){
        

        

        console.log("LOCATION DATA:----------->",this.props.location.hash.slice(14,44))
    }
    
  render() {
    return (
      <div className="App">
        <MainSection/>
        <Chat-Section id="chat-section" ><Chat oauth={this.props.location.hash.slice(14,44)}/></Chat-Section>
      </div>
    );
  }
}

export default StreamPanel;