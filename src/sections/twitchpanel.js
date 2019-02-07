import React, {Component, Fragment} from 'react';
import "../App.css"
import {streamer} from "../helpers/dummydata"
import CommandsModal from './commandsModal'
import {Modal} from 'react-materialize'
import Commands from './commands'
// import SceneBtn from './scenebtn'
// import {twitchBtns} from '../helpers/dummydata'

class TwitchPanel extends Component{
    state={
        "followers-only": null,
        "subs-only": null,
        slow: null,
        "emote-only": null,
        active:null,
        showModal: false,
    }
    client = this.props.client
    
        
getChatMode=()=>{
    
    this.client.on("roomstate", (channel, state)=> {
        let activeText = []
        if(state["followers-only"]>0){
            activeText.push("FOL")
        }
        if(state["subs-only"]){
            activeText.push("SUB")
        }
        if(state.slow){
            activeText.push("SLW")
        }
        if(activeText.length==0){
            activeText = "NORMAL"
        }
        
        console.log("CHAT MODE",state)
        
            this.setState({
                active: activeText
            })
        
        
    });
}
       runAd=()=>{
            
            
            
            this.client.commercial(streamer, 30).then(function(data) {
                // data returns [channel, seconds]
            }).catch(function(err) {
                //
                console.log(err)
            });
            
        }
        
        unrunAd=()=>{
            console.log("clicked unrun ad part 1")
            this.ad = false;
    
        }

        componentDidMount(){
            this.getChatMode()
        }

        render(){
            let modal= null
            if(this.state.showModal){
                modal = 
                <Fragment><div className="commands-container" onClick={()=>{
                    console.log(this.state.showModal)
                    this.setState({
                    showModal: !this.state.showModal
                })}}></div><CommandsModal/></Fragment>
            }
            return (<div className='source-panel'>
            {modal}
            <div className="twitch-btn"  onClick={()=>{this.runAd()}}>
                <i className="material-icons">
                monetization_on
                </i>
                <div className='label'>RUN AD</div>
            </div>
            <div className="twitch-btn" onClick={()=>{
                    console.log(this.state.showModal)
                    this.setState({
                    showModal: !this.state.showModal
                })}}>

                <i className="material-icons">
                adb
                </i>
                <div className='label' >COMMANDS</div>
                
                
            </div>
                
                
            
            <div className="twitch-btn"  onClick={()=>{console.log(" clicked")}}>
                <i className="material-icons">
                chat
                </i>
                <div className='label'>CHAT-MODE
                                    <div>{this.state.active}</div>
                </div>
            </div>
        
    </div>)
        }
        
    
    
}
export default TwitchPanel