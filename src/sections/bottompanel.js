import React, {Component} from 'react';
import './bottompanel.css';
import ChannelStatus from './channelstatus'
import Notifications from './notifications'
import Numbers from './numbers'
import { MyContext } from '../helpers/provider';

class BottomPanel extends Component{
    
    
        server=this.props.server
        stream = null
        oauth= this.props.oauth
        
        fps=null
        droppedFrames = null
        cpuUsage = null
        bitRate = null
        streamTime = null

        status = null
        btnClass= null
        icon=null
        iconStyle = {}
        state={
            streaming: null,
            recording: null,
            event:this.props.event
        }
        

        getOBSStreamStatus(){
            this.props.server.send({'request-type': 'GetStreamingStatus'}).then(data=>{
                this.setState({
                    streaming: data.streaming,
                    recording: data.recording
                })
                
            })
        }

        toggleStream = ()=>{
            console.log("CLICKED TOGGLESTREAM")
            this.props.server.send({'request-type': 'StartStopStreaming'}).then(data=>{
                console.log("TOGGLESTREAM RESP DATA", data)
        })
    
    }
    componentDidUpdate(prev){
        if(this.props.server !== prev.server)
        this.getOBSStreamStatus() 
    }
    componentDidMount(){
        
        
        console.log("EVENT IN BOTTOM", this.state.event)
        // this.props.server.addMessageListener( this.handleServerEvent);
        console.log("MY SREAMINGSTATUS IN BOPA",this.props.OBSOBJ.streamingStatus)
    
    console.log("MY STATE IN BOTOMPANEL", this)
    
    

    }

    
    
render(){
    // console.log("my chan obj", this.props.channelOBJ)
    if(this.state.streaming){
        this.stream = "STOP STREAM"
        this.status ="You are streaming"
        this.btnClass ="streaming"
        this.icon="cast_connected"
        this.iconStyle={"color":"green",
                    "font-size":"2em"}
        
    
                            

} else {

        this.stream = "START STREAM"
        this.status="You are not streaming"
        this.btnClass ="not-streaming"
        this.icon="cast"
        this.iconStyle={"color":"white",
                    fontSize:"2em"}
        
    
                            
}

if(this.props.event && this.props.event["update-type"]){
    // console.log(this.props.event)
    if(this.props.event["update-type"]==="StreamStarting"){

        this.status = "Stream is starting..."
    }
    else if(this.props.event["update-type"]==="StreamStarted"){
        this.stream = "STOP STREAM"
        this.status = "You are streaming"
    }
    else if(this.props.event["update-type"]==="StreamStopping"){
        this.status = "Stream is stopping..."
    }
    else if(this.props.event["update-type"]==="StreamStopped"){
        this.stream = "START STREAM"
        this.status = "You are not streaming"
    }

}

if(this.props.event && this.props.event["update-type"]==="StreamStatus"){
    this.fps = this.props.event.fps
    this.droppedFrames = this.props.event["num-dropped-frames"]
    this.cpuUsage = this.props.event.strain
    this.bitRate = this.props.event["kbits-per-sec"]
    this.streamTime = this.props.event["total-stream-time"].toString()

}

    return(
        <MyContext.Consumer>
        {context=>


                <div className="bottom-panel" >
        
            <div className="bottom-left-container">
                <div className="profiles-btn">
                <div className={this.btnClass} onClick={()=>{this.toggleStream()
                }}>
                    
                    <div className="label2">{this.status}
                    </div>
                    <div className="stream">{this.stream}</div>
                    <i className="material-icons" style={this.iconStyle}>
                    {this.icon}
                    </i>
                </div>
                </div>
                
                <div className="profiles-btn">
                <Numbers channelOBJ={this.props.channelOBJ} />
                <div className="label2">CPU: {this.cpuUsage}</div>
                <div className="label2">Bit-rate: {this.bitRate}</div>
                <div className="label2">Dropped: {this.droppedFrames}</div>
                <div className="label2">Uptime: {this.streamTime}</div>
                
                </div>
                <div className="profiles-btn" style={{width:"50%"}} onClick={(e)=>{console.log(e.type)
                context.showHideScreen("profile", true)}}>
                
                <div className="label">PRESETS</div>
                <div className="label2">Bit-rate: {this.bitRate}</div>
                
                
                </div>
                <div className="profiles-btn" style={{width:"50%"}} onClick={(e)=>{console.log(e.type)
                context.showHideScreen("update", true)}}>
                
                <div className="label">UPDATE</div>
                <div className="label2">Bit-rate: {this.bitRate}</div>
                
                
                </div>
                
            </div>
            <div className="bottom-middle-container">
                <ChannelStatus channelOBJ={this.props.channelOBJ} context={context}/>
            </div>
            <div className="bottom-right-container">
                <Notifications userID={context.state.myId} client={context.state.client}/>
                
            </div>
            
            
        </div>

            }
        

        </MyContext.Consumer>
        
    )
}
    
}

export default BottomPanel;