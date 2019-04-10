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
        testString = "?bandwidthtest=true"
        
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
            event:this.props.event,
            streamKey: null,
            testDiv: <div className="chicken-counter2" style={{width:"50%",height:"100%"}} >wait</div>
            
        }
        

        getOBSStreamStatus(){
            this.props.server.send({'request-type': 'GetStreamingStatus'}).then(data=>{
                this.setState({
                    streaming: data.streaming,
                    recording: data.recording
                })
                
            })
        }

        toggleStream = (key)=>{
            this.props.server.send({'request-type': 'SetStreamSettings',
            settings: {
                key:key
            },
            save:true
        }).then(data=>{
            this.props.server.send({'request-type': 'StartStopStreaming'}).then(data=>{
                console.log("start stop:", data)
            })
        })
       
    }

    toggleTestStream = (key)=>{
        this.props.server.send({'request-type': 'SetStreamSettings',
        settings: {
            key:key+this.testString
        },
        save:true
    }).then(data=>{
        this.props.server.send({'request-type': 'StartStopStreaming'}).then(data=>{
            console.log("start stop:", data)
        })
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

    setStreamKey=(server,key,test)=>{
        
        server.send({'request-type': 'SetStreamSettings',
        settings: {
            key:test?key+this.testString: key
        },
        save:true
    }).then(data=>{
        console.log("stream settings", data)
    })
}

getStreamKey=(server)=>{
    server.send({'request-type': 'GetStreamSettings'}).then(data=>{
        console.log("stream settings", data)
    })
}

    

    componentDidUpdate(prev){

        if(this.props.event && (this.props.event["update-type"]==="StreamStarted") && (this.props.event["update-type"] !== prev.event["update-type"])){
            console.log("Streaming is true")
            this.setState({
                streaming: true
            })
        }

        if(this.props.event && (this.props.event["update-type"]==="StreamStopped") && (this.props.event["update-type"] !== prev.event["update-type"])){
            this.setState({
                streaming: false
            })
        }
        
        if(this.props.server !== prev.server){
        this.getOBSStreamStatus() 
        }
        if(this.props.context.state.streamKey !== prev.context.state.streamKey){
            console.log("we ran")
            this.setState({
                streamKey: this.props.context.state.streamKey,
                testDiv: null
            })
            }
    }
        
    componentDidMount(){
        
        
        console.log("EVENT IN BOTTOM", this.state.event)
        // this.props.server.addMessageListener( this.handleServerEvent);
        console.log("MY SREAMINGSTATUS IN BOPA",this.props.OBSOBJ.streamingStatus)
    
    console.log("MY STATE IN BOTOMPANEL", this)
    
    

    }

    
    
render(){
    console.log("bottom panel rendered")
//     if(this.state.streaming){
//         this.stream = "STOP STREAM"
//         this.status ="You are streaming"
//         this.btnClass ="streaming"
//         this.icon="cast_connected"
//         this.iconStyle={"color":"green",
//                     "font-size":"2em"}
        
    
                            

// } else {

//         this.stream = "START STREAM"
//         this.status="You are not streaming"
//         this.btnClass ="not-streaming"
//         this.icon="cast"
//         this.iconStyle={"color":"white",
//                     fontSize:"2em"}
        
    
                            
// }

// if(this.props.event && this.props.event["update-type"]){
//     // console.log(this.props.event)
//     if(this.props.event["update-type"]==="StreamStarting"){

//         this.status = "Stream is starting..."
//     }
//     else if(this.props.event["update-type"]==="StreamStarted"){
//         this.stream = "STOP STREAM"
//         this.status = "You are streaming"
//     }
//     else if(this.props.event["update-type"]==="StreamStopping"){
//         this.status = "Stream is stopping..."
//     }
//     else if(this.props.event["update-type"]==="StreamStopped"){
//         this.stream = "START STREAM"
//         this.status = "You are not streaming"
//     }

// }

// if(this.props.event && this.props.event["update-type"]==="StreamStatus"){
//     this.fps = this.props.event.fps
//     this.droppedFrames = this.props.event["num-dropped-frames"]
//     this.cpuUsage = this.props.event.strain
//     this.bitRate = this.props.event["kbits-per-sec"]
//     this.streamTime = this.props.event["total-stream-time"].toString()

// }

    return(
        <MyContext.Consumer>
        {context=>


                <div className="bottom-panel" >
        
            <div className="bottom-left-container">
                <div className="profiles-btn">
                <div className={this.state.streaming?"streaming": "not-streaming"} style={{"color":this.state.streaming?"green":"white",
                    fontSize:"1.5rem"}} onClick={()=>{this.toggleStream(this.props.context.state.streamKey)
                }}>
                    
                    <div className="label2">{this.state.streaming?"STOP STREAM": "START STREAM"}
                    </div>
                    {/* <div className="stream">{this.stream}</div> */}
                    <i className="material-icons" style={{"color":this.state.streaming?"green":"white",
                    fontSize:"2rem"}}>
                    {this.state.streaming?"cast-connected":"cast"}
                    </i>
                </div>
                </div>
                
                <div className="profiles-btn">
                <div className="profiles-btn" style={{display:"flex", flexDirection:"column", height:"100%"}}>
                <div style={{height:"50%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <div className="chicken-counter" style={{width:"50%",height:"100%"}} onClick={()=>{this.toggleTestStream(this.props.context.state.streamKey)}}>Test Stream</div>
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
                    
                    <div className="chicken-counter2" style={{width:"50%",height:"100%"}} onClick={()=>{this.getStreamKey(this.props.server)}}>GET</div>
                    <div className="chicken-counter2" style={{width:"50%",height:"100%"}} >N/A</div>
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
            <div className="tiny-btns">
                <div className="tiny-btn">1</div>
                <div className="tiny-btn">2</div>
                <div className="tiny-btn">3</div>
                <div className="tiny-btn">4</div>
            </div>
            
            
        </div>

            }
        

        </MyContext.Consumer>
        
    )
}
    
}

export default BottomPanel;