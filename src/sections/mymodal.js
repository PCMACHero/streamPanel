import React, {Component} from "react"


//props = title , function1-4, btn1-4
class MyModal extends Component{
    state={
        fol: null,
        slow: null,
        sub: null,
        emote: null
        
    }
  
    // componentDidUpdate(prev){
    //     if(prev.client===null && this.props.client){

    //     }
    // }
    

    toggleChatMode=(type)=>{
        if (type==="fol"){
            if(this.props.context.state.chatMode["followers-only"]>0){
                this.props.context.state.client.followersonlyoff("streampanelapp");
            }else{
                this.props.context.state.client.followersonly("streampanelapp");
            }
        }
        if (type==="slow"){
            if(this.props.context.state.chatMode["slow"]){
                this.props.context.state.client.slowoff("streampanelapp");
            }else{
                this.props.context.state.client.slow("streampanelapp");
            }
            
            console.log("ran toggle")
            console.log(this.props.context.state.client)
        }
        if (type==="sub"){
            if(this.props.context.state.chatMode["subs-only"]){
                this.props.context.state.client.subscribersoff("streampanelapp");
            }else{
                this.props.context.state.client.subscribers("streampanelapp");
            }
            
            console.log("ran toggle")
            console.log(this.props.context.state.client)
        }
        if (type==="emote"){
            if(this.props.context.state.chatMode["emote-only"]){
                this.props.context.state.client.emoteonlyoff("streampanelapp");
            }else{
                this.props.context.state.client.emoteonly("streampanelapp");
            }
            
            console.log("ran toggle")
            console.log(this.props.context.state.client)
        }
        
    }
    componentDidUpdate(prev){
        console.log("mymodal updated")
        
        if(prev.context.state.chatMode && this.props.context.state.chatMode!== prev.context.state.chatMode){
            if(this.props.context.state.chatMode["followers-only"] && this.props.context.state.chatMode["followers-only"]!=="-1"){
                this.setState({
                    fol: true
                })
                
            }
            
        }
    }
    componentDidMount(){
        
        
    }

    render(){
        let btn1={backgroundColor:"#EE2B2A"}
        let btn2={backgroundColor:"#EE2B2A"}
        let btn3={backgroundColor:"#EE2B2A"}
        let btn4={backgroundColor:"#EE2B2A"}

        if(this.props.context.state.chatMode["followers-only"] && this.props.context.state.chatMode["followers-only"]!=="-1"){
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
                            <div className="btn c-m-btn" style={{backgroundColor:this.props.context.state.chatMode["followers-only"]>0? "green": "red"}}
                                onClick={()=>{this.toggleChatMode("fol")}}>{this.props.context.state.chatMode["followers-only"]}
                            </div>
                            <div className="btn c-m-btn" style={{backgroundColor:this.props.context.state.chatMode["subs-only"]? "green": "red"}} onClick={()=>{this.toggleChatMode("sub")}}
                            // onClick={()=>{this.props.function2()}}
                            >SUBS-MODE</div>
                            
                        </div>
                        <div className="m-c-side">
                            <div className="btn c-m-btn-bad" style={{backgroundColor:this.props.context.state.chatMode["slow"]? "green": "red"}} onClick={()=>{this.toggleChatMode("slow")}}
                            // onClick={()=>{this.props.function3()}}
                            >SLOW-MODE</div>
                            <div className="btn c-m-btn-bad" style={{backgroundColor:this.props.context.state.chatMode["emote-only"]? "green": "red"}} onClick={()=>{this.toggleChatMode("emote")}}
                            // onClick={()=>{this.props.function4()}}
                            >EMOTE-MODE</div>
                        </div>
                        
                        
                        
    
                    </div>
                </div>
                    
                
                    
                    
                    
                
                
            )
        
}
}

export default MyModal