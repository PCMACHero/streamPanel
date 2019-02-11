import React, {Component} from "react"


//props = title , function1-4, btn1-4
class MyModal extends Component{
    state={
        fMode:null,
        swMode:null,
        sbMode:null,
        eMode:null,
        
    }
  
    // componentDidUpdate(prev){
    //     if(prev.client===null && this.props.client){

    //     }
    // }
    componentDidMount(){
        
        
    }

    render(){
        let btn1={backgroundColor:"#EE2B2A"}
        let btn2={backgroundColor:"#EE2B2A"}
        let btn3={backgroundColor:"#EE2B2A"}
        let btn4={backgroundColor:"#EE2B2A"}

        if(this.props.modes["followers-only"]){
            btn1 = {backgroundColor:"#1ACA7B"}
        }if(this.props.modes["subs-only"]){
            btn2 = {backgroundColor:"#1ACA7B"}
        }if(this.props.modes.slow){
            btn3 = {backgroundColor:"#1ACA7B"}
        }if(this.props.modes["emotes-only"]){
            btn4 = {backgroundColor:"#1ACA7B"}
        }
        
            return (
                <div className="btns-modal">
                    <div className="chat-modal">
                        
                    <div className="modal-title">{this.props.title}</div>
                    <div className="modal-content">
                        <div className="m-c-side">
                            <div className="btn c-m-btn" style={btn1}
                                onClick={()=>{this.props.function1(this.props.client)}}>{this.props.btn1}
                            </div>
                            <div className="btn c-m-btn" style={btn2}
                            // onClick={()=>{this.props.function2()}}
                            >SUBS-MODE</div>
                            
                        </div>
                        <div className="m-c-side">
                            <div className="btn c-m-btn-bad" style={btn3}
                            // onClick={()=>{this.props.function3()}}
                            >SLOW-MODE</div>
                            <div className="btn c-m-btn-bad" style={btn4}
                            // onClick={()=>{this.props.function4()}}
                            >EMOTE-MODE</div>
                        </div>
                        
                        
                        
    
                    </div>
                </div>
                    
                </div>
                    
                    
                    
                
                
            )
        
}
}

export default MyModal