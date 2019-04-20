import React, {Component} from "react"


//props = title , function1-4, btn1-4
class ChatModal extends Component{
    state={
        fol: null,
        slow: null,
        sub: null,
        emote: null
        
    }
    
    getFirstModes=(context)=>{
        this.setState({
            fol: context.state["followers-only"],
            slow: context.state["slow"],
            sub: context.state["subs-only"],
            emote: context.state["emote-only"],
        })
    }
    
    toggleChatMode=(type, chan)=>{
        if (type==="fol"){
            console.log("fol clicked",this.props.context.state)
            if(this.props.context.state["followers-only"]){
                console.log("fol off ran",this.props.context.state)
                this.props.context.state.client.followersonlyoff(chan);
            }else{
                console.log("fol on ran",this.props.context.state)
                this.props.context.state.client.followersonly(chan);
            }
        }
        if (type==="slow"){
            if(this.props.context.state["slow"]){
                this.props.context.state.client.slowoff(chan);
            }else{
                this.props.context.state.client.slow(chan);
            }
            
            console.log("ran toggle")
            console.log(this.props.context.state.client)
        }
        if (type==="sub"){
            if(this.props.context.state["subs-only"]){
                this.props.context.state.client.subscribersoff(chan);
            }else{
                this.props.context.state.client.subscribers(chan);
            }
            
            console.log("ran toggle")
            console.log(this.props.context.state.client)
        }
        if (type==="emote"){
            if(this.props.context.state["emote-only"]){
                this.props.context.state.client.emoteonlyoff(chan);
            }else{
                this.props.context.state.client.emoteonly(chan);
            }
            
            console.log("ran toggle")
            console.log(this.props.context.state.client)
        }
        
    }
    componentDidUpdate(prev){
        console.log("mymodal updated")
        
        
            // if(this.props.context.state["followers-only"] !== undefined && this.props.context.state["followers-only"] !== prev.context.state["followers-only"]){
                
            //         this.setState({
            //             fol: this.props.context.state["followers-only"]
            //         })
                
            //     }
                
                
            
            // if(this.props.context.state["subs-only"] !== undefined && this.props.context.state["subs-only"] !== prev.context.state["subs-only"]){
            //     this.setState({
            //         sub: this.props.context.state["subs-only"]
            //     })
                
            // }
            // if(this.props.context.state["slow"] !== undefined && this.props.context.state["slow"] !== prev.context.state["slow"]){
            //     this.setState({
            //         slow: this.props.context.state["slow"]
            //     })
                
            // }
            // if(this.props.context.state["emote-only"] !== undefined && this.props.context.state["emote-only"] !== prev.context.state["emotes-only"]){
            //     this.setState({
            //         emote: this.props.context.state["emote-only"]
            //     })
                
            // }
            
        
    }
    componentDidMount(){
        this.getFirstModes(this.props.context)
        
    }

    render(){
        console.log("My fol", this.props.context.state["followers-only"])
        console.log("My slow", this.props.context.state["slow"])
        console.log("My sub", this.props.context.state["subs-only"])
        console.log("My emote", this.props.context.state["emote-only"])
        let btn1={backgroundColor:"#EE2B2A"}
        let btn2={backgroundColor:"#EE2B2A"}
        let btn3={backgroundColor:"#EE2B2A"}
        let btn4={backgroundColor:"#EE2B2A"}

        if(this.props.context.state["followers-only"] && this.props.context.state["followers-only"]!=="-1"){
            btn1 = {backgroundColor:"#1ACA7B"}
        }
        // if(this.props.modes["subs-only"]){
        //     btn2 = {backgroundColor:"#1ACA7B"}
        // }if(this.props.modes.slow){
        //     btn3 = {backgroundColor:"#1ACA7B"}
        // }if(this.props.modes["emotes-only"]){
        //     btn4 = {backgroundColor:"#1ACA7B"}
        // }
        
            return (
                
                    <div className="chat-modal" style={{backgroundColor:"transparent"}}>
                        
                    {/* <div className="modal-title">{this.props.title}</div> */}
                    <div className="modal-content" style={{backgroundColor:""}}>
                        <div className="m-c-side">
                            <div className="btn c-m-btn" style={{backgroundColor:this.props.context.state["followers-only"]? "green": "red"}}
                                onClick={()=>{this.toggleChatMode("fol", this.props.context.state.displayName)}}>FOLLOWERS-ONLY
                            </div>
                            <div className="btn c-m-btn" style={{backgroundColor:this.props.context.state["subs-only"]? "green": "red"}} onClick={()=>{this.toggleChatMode("sub", this.props.context.state.displayName)}}
                            // onClick={()=>{this.props.function2()}}
                            >SUBS-MODE</div>
                            
                        </div>
                        <div className="m-c-side">
                            <div className="btn c-m-btn-bad" style={{backgroundColor:this.props.context.state["slow"]? "green": "red"}} onClick={()=>{this.toggleChatMode("slow", this.props.context.state.displayName)}}
                            // onClick={()=>{this.props.function3()}}
                            >SLOW-MODE</div>
                            <div className="btn c-m-btn-bad" style={{backgroundColor:this.props.context.state["emote-only"]? "green": "red"}} onClick={()=>{this.toggleChatMode("emote", this.props.context.state.displayName)}}
                            // onClick={()=>{this.props.function4()}}
                            >EMOTE-MODE</div>
                        </div>
                        
                        
                        
    
                    </div>
                </div>
                    
                
                    
                    
                    
                
                
            )
        
}
}

export default ChatModal