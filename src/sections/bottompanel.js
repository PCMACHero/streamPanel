import React from "react";
import './bottompanel.css'

const BottomPanel = (props)=>{
    let streamStatus = props.streamingStatus;
    let statusMessage = props.statusMessage;
    let statusText = null;
    let btnClass= null;
    let icon=null;
    let iconStyle = {}
    
    if(streamStatus){
        statusText = "You are streaming"
        btnClass = "streaming"
        icon="cast_connected"
        iconStyle={"color":"green",
                    "font-size":"2em"
                                
    }
    } else {statusText = "You are not streaming"
        btnClass = "not-streaming"}
        icon="cast"
        iconStyle={"color":"white",
                    "font-size":"2em"
                                
    }
    if (statusMessage!==null){
        statusText=null
    }

    return(
        
        <div className="bottom-panel" >
            <div className="bottom-left-container">
                <div className={btnClass} onClick={()=>{props.func()}}>
                    <div className="label2">{statusText}{statusMessage}
                    </div>
                    <i class="material-icons" style={iconStyle}>
                    {icon}
                    </i>
                </div>
                <div className={btnClass}>
                    <div className="label2">PROFILES</div>
                </div>
                
            </div>
            
            
        </div>
    )
}

export default BottomPanel;