import React, {Component} from 'react';
import './bottompanel.css';
import ChannelStatus from './channelstatus'
import Notifications from './notifications'
import Numbers from './numbers'

class BottomPanel extends Component{
    
    
    
        oauth= this.props.oauth
        statusText = null
        btnClass= null
        icon=null
        iconStyle = {}
    
        
    

    componentDidMount(){
        
        console.log("MY SREAMINGSTATUS IN BOPA",this.props.OBSOBJ.streamingStatus)
    
    console.log("MY STATE IN BOTOMPANEL", this)
    
    

    }

    
    
render(){
    // console.log("my chan obj", this.props.channelOBJ)
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
                    fontSize:"2em"}
        
    
                            
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
                {/* <div>{this.props.micSources.name}</div>
                <div> {this.props.micSources.muted.toString()}</div> */}
                <Numbers channelOBJ={this.props.channelOBJ} />
                </div>
                
            </div>
            <div className="bottom-middle-container">
                <ChannelStatus channelOBJ={this.props.channelOBJ} oauth={this.oauth}/>
            </div>
            <div className="bottom-right-container">
                <Notifications userID={this.props.channelOBJ.userID} client={this.props.client}/>
                
            </div>
            
            
        </div>
    )
}
    
}

export default BottomPanel;