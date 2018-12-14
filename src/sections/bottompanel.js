import React, {Component} from 'react';
import './bottompanel.css';
import ChannelStatus from './channelstatus'

class BottomPanel extends Component{
    
    
    
        
        statusText = null
        btnClass= null
        icon=null
        iconStyle = {}
    
    
    

    componentDidMount(){
        console.log("MY SREAMINGSTATUS IN BOPA",this.props.OBSOBJ.streamingStatus)
    
    console.log("MY STATE IN BOTOMPANEL", this)
    
    

    }

    
    
render(){
    if(this.props.OBSOBJ.streamingStatus){
        
        this.statusText ="You are streaming"
        this.btnClass ="streaming"
        this.icon="cast_connected"
        this.iconStyle={"color":"green",
                    "font-size":"2em"}
        
    
                            

} else {

    
        this.statusText ="You are not streaming"
        this.btnClass ="not-streaming"
        this.icon="cast"
        this.iconStyle={"color":"white",
                    "font-size":"2em"}
        
    
                            
}
if (this.props.OBSOBJ.statusMessage!==null){
    this.statusText=null
}
    return(
        
        <div className="bottom-panel" >
            <div className="bottom-left-container">
                <div className={this.btnClass} onClick={()=>{this.props.func()
                }}>
                    <div className="label2">{this.props.OBSOBJ.statusMessage}{this.statusText}
                    </div>
                    <i className="material-icons" style={this.iconStyle}>
                    {this.icon}
                    </i>
                </div>
                <div className="profiles-btn">
                    <div className="label2">{this.props.OBSOBJ.streamingStatus}</div>
                </div>
                
            </div>
            <div className="bottom-middle-container">
                <ChannelStatus channelOBJ={this.props.ChannelOBJ}/>
            </div>
            
            
        </div>
    )
}
    
}

export default BottomPanel;