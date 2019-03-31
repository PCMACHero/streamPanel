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

    increaseOBSCounter=(line1,num, line2)=>{
        console.log("increased", this.props.context.state)
        
           let newNum = num+1
           let string = `${line1===""?"":line1+" "}${newNum}${line2===""?"":" "+line2}`
        
        
        this.props.context.updateState("OBSCounter", newNum)
        this.props.context.state.OBSServer.send({
            "request-type": "SetTextFreetype2Properties",
            "source": "counterSP",
            "text":string
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
    console.log("bottom panel rendered")
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
                <div className="profiles-btn" style={{display:"flex", flexDirection:"column", height:"100%"}}>
                <div style={{height:"50%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <div className="chicken-counter" style={{width:"50%",height:"100%"}}>yes</div>
                    <div className="chicken-counter" style={{width:"50%",height:"100%"}} onClick={()=>{this.increaseOBSCounter(this.props.context.state.OBSCounterLine1, -1, this.props.context.state.OBSCounterLine2)}}>RESET</div>
                </div>
                <div  style={{height:"50%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    
                    <div className="chicken-counter2" style={{width:"50%",height:"100%"}} onClick={()=>{this.increaseOBSCounter(this.props.context.state.OBSCounterLine1, this.props.context.state.OBSCounter-2, this.props.context.state.OBSCounterLine2)}}>-</div>
                    <div className="chicken-counter2" style={{width:"50%",height:"100%"}} onClick={()=>{this.increaseOBSCounter(this.props.context.state.OBSCounterLine1, this.props.context.state.OBSCounter, this.props.context.state.OBSCounterLine2)}}>+</div>
                </div>
            
            
        </div>  
                
        <div className="profiles-btn" style={{display:"flex", flexDirection:"column", height:"100%"}}>
                <div style={{height:"50%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <div className="chicken-counter" style={{width:"50%",height:"100%"}} onClick={(e)=>{console.log(e.type)
                            context.showHideScreen("profile", true)}}>PRESETS</div>
                    <div className="chicken-counter" style={{width:"50%",height:"100%"}} onClick={(e)=>{console.log(e.type)
                            context.showHideScreen("update", true)}}>UPDATE</div>
                </div>
                <div  style={{height:"50%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    
                    <div className="chicken-counter2" style={{width:"50%",height:"100%"}} onClick={()=>{this.increaseOBSCounter(this.props.context.state.OBSCounterLine1, this.props.context.state.OBSCounter-2, this.props.context.state.OBSCounterLine2)}}>SETTINGS</div>
                    <div className="chicken-counter2" style={{width:"50%",height:"100%"}} onClick={()=>{this.increaseOBSCounter(this.props.context.state.OBSCounterLine1, this.props.context.state.OBSCounter, this.props.context.state.OBSCounterLine2)}}>YES</div>
                </div>
            
            
        </div>


                {/* <Numbers channelOBJ={this.props.channelOBJ} /> */}
                {/* <div className="label2">CPU: {this.cpuUsage}</div>
                <div className="label2">Bit-rate: {this.bitRate}</div>
                <div className="label2">Dropped: {this.droppedFrames}</div>
                <div className="label2">Uptime: {this.streamTime}</div> */}
                
                </div>



                
                
            </div>
            <div className="bottom-middle-container">
                <ChannelStatus channelOBJ={this.props.channelOBJ} twitchId={context.state.twitchId} context={context}/>
            </div>
            <div className="bottom-right-container">
                <Notifications userID={context.state.twitchId} context={context} client={context.state.client}/>
                
            </div>
            
            
        </div>

            }
        

        </MyContext.Consumer>
        
    )
}
    
}

export default BottomPanel;