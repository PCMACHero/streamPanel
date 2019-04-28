import React, {Component, Fragment} from 'react';
import "../App.css"
import {streamer} from "../helpers/dummydata"
import CommandsModal from './commandsModal'
import {Modal} from 'react-materialize'
import Commands from './commands'
import {MyContext} from '../helpers/provider'
import MyModal from './chatmode';
// import SceneBtn from './scenebtn'
// import {twitchBtns} from '../helpers/dummydata'

class TwitchPanel extends Component{
    state={
        
        active:null,
        showModal: false,
        myModal: null,
    }
    counter=0
    client = this.props.client
    



getChatModeBetter=(client)=>{

    

    client.on("followersonly", (channel, enabled, length) => {
        console.log("yay it ran", enabled)
        
        this.props.context.updateState({"followers-only": enabled})
    });

    client.on("subscribers", (channel, enabled) => {
        this.props.context.updateState({"subs-only": enabled})
    });


    client.on("slowmode", (channel, enabled, length) => {
        this.props.context.updateState({"slow": enabled})
    });

    client.on("emoteonly", (channel, enabled) => {
        this.props.context.updateState({"emote-only": enabled})
    });
}

getFirstChatMode=(client)=>{
    
        client.on("roomstate", (channel, state)=> {
            
                console.log("ROOMSTATE now", state)
            
            let activeText = ""
            if(state["followers-only"] !== undefined){
                
                let fol = false
                if(state["followers-only"]>0){
                    fol = true
                }
                console.log("follows only is", fol)
                this.props.context.updateState("followers-only", fol)
                
                activeText+="F/"
            }
            if(state["subs-only"] !== undefined){
                this.props.context.updateState("subs-only", state["subs-only"])
                activeText+="SB/"
            }
            if(state.slow !== undefined){
                let sl = false
                if(state["slow"]>0){
                    sl = true
                }
                this.props.context.updateState("slow", sl)
                activeText+="SL/"
            }
            if(state["emote-only"] !== undefined){
                this.props.context.updateState("emote-only", state["emote-only"])
                activeText+="E/"
            }
            
            if(activeText.length==0){
                activeText = "NORMAL"
            }
            
            console.log("CHAT MODE",state)
            
            
                
                
            
            
                
            
            
        });
    
    
}


       runAd=(chan)=>{
            
            
            
            this.props.client.commercial(chan, 30).then(data=> {
                // data returns [channel, seconds]
                this.props.newMessage(data)

            }).catch(err=> {
                //
                this.props.newMessage(`Cannot run ad: "${err}"`)
            });
            
        }
        
        unrunAd=()=>{
            console.log("clicked unrun ad part 1")
            this.ad = false;
    
        }
        componentDidUpdate(prev){
            if(prev.client===null && this.props.client){
                this.getFirstChatMode(this.props.client)
                // this.getChatModeBetter(this.props.client)
            }
        }
        componentDidMount(){
            
            
        }

        render(){

            




            
            return (
                <Fragment>
                    
                
                <div className='twitch-panel'>
                
                <div className="twitch-btn"  onClick={()=>{this.runAd(this.props.context.state.displayName) }}>
                    <i className="material-icons">
                    monetization_on
                    </i>
                    <div className='label'>RUN AD</div>
                </div>
                <div className="twitch-btn" onClick={()=>{

                        
                        if(this.props.context.state.scopeToChat){
                            this.props.context.showHideScreen("commands", "on")
                        }else{
                            alert("You need to login elevated privilages to use this feature. Use the link on the home page")
                        }
                        }}>
    
                    <i className="material-icons">
                    adb
                    </i>
                    <div className='label' >{this.props.context.state.scopeToChat?"COMMANDS":"COMMANDS DISABLED"}</div>
                    
                    
                </div>
                    
                    
                <div className="twitch-btn" onClick={(e)=>{
    
                    this.props.context.showHideScreen("chatMode", "on")
                    console.log("clicked")
                    }}>
                    <i className="material-icons">
                    chat
                    </i>
                    
                    <div className='label'>CHAT-MODE
                                        <div>{this.state.active}</div>
                    </div>
                </div>
            
        </div>
                </Fragment>
                
                
    
    )
        }
        
    
    
}
export default TwitchPanel