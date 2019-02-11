import React, {Component, Fragment} from 'react';
import "../App.css"
import {streamer} from "../helpers/dummydata"
import CommandsModal from './commandsModal'
import {Modal} from 'react-materialize'
import Commands from './commands'
import {MyContext} from '../helpers/provider'
import MyModal from './mymodal';
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
        myModal: null,
    }
    client = this.props.client
    
hideMyModal=()=>{
    console.log("tried to hide modal")
    this.setState({
        myModal:null
    })
}
showMyModal=()=>{
    this.setState({
        myModal: <Fragment>
            
            <div className="modal-back" onClick={()=>{
            console.log(this.state.myModal)
            this.setState({
            myModal: null
        })}}></div><MyModal title="CHAT-MODE" btn1="FOLLOW-ONLY" client={this.props.client} modes={this.state} function1={this.toggleFMode}/></Fragment>
    })
}
getChatMode=(client)=>{
    
    client.on("roomstate", (channel, state)=> {
        let activeText = ""
        if(state["followers-only"]>0){
            activeText+="F/"
        }
        if(state["subs-only"]){
            activeText+="SB/"
        }
        if(state.slow){
            activeText+="SL/"
        }
        if(state["emote-only"]){
            activeText+="E/"
        }
        
        if(activeText.length==0){
            activeText = "NORMAL"
        }
        
        console.log("CHAT MODE",state)

        
            this.setState({
                active: activeText,
                "followers-only": state["followers-only"],
                "subs-only": state["subs-only"],
                slow: state.slow,
                "emote-only": state["emote-only"],

            })
        
        
    });
}

toggleFMode=(client)=>{
    client.followersonly(streamer, 30)
.then((data) => {
    console.log(data)
    this.props.newMessage(data)
    // data returns [channel, minutes]
}).catch((err) => {
    this.props.newMessage(err)
    console.log(err)
});

}
       runAd=()=>{
            
            
            
            this.props.client.commercial(streamer, 30).then(data=> {
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
                this.getChatMode(this.props.client)
            }
        }
        componentDidMount(){
            
            
        }

        render(){

            let modal= null
            if(this.state.showModal){
                modal = 
                <Fragment><div className="modal-back" onClick={()=>{
                    
                    this.setState({
                    showModal: !this.state.showModal
                })}}></div><CommandsModal/></Fragment>
            }




            
            return (
                <Fragment>
                    {this.state.myModal}
                
                <div className='source-panel'>
                {modal}
                <div className="twitch-btn"  onClick={()=>{this.runAd() }}>
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
                    
                    
                
                <div className="twitch-btn" onClick={(e)=>{
    
                    this.showMyModal()
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