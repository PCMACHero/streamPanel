import React, {Component} from 'react';
// import Slider from 'react-materialize/lib/Slider';
// import SceneBtn from './scenebtn'
// import {OBSSourcesObj} from '../helpers/dummydata'

class SourcePanel extends Component {
        
        state = {
            clicked0: false,
            
            micArray:[],

            
            sourcesDivs:null,
        }
        // server = this.props.server
        icon =null
        
        srcClass=null;
        sourceMap = {
            'coreaudio_input_capture': 'mic',
            'av_capture_input' : 'videocam'
        }

        changeHandler = (event)=>{
            this.setState({
                [event.target.name]: event.target.value
            })
            }

getVol=(mics, server)=>{
    for(let i = 0; i<mics.length;i++){
        server.send({'request-type': 'GetVolume','source':mics[i].name}).then(data=>{
            console.log("VOLUME", data)
            this.setState({
                [`defSlider${i}`]:data.volume
            }
                
            )
        })
    }
    

}

setVol=(mic,i, val, server)=>{
    console.log("val is",typeof(val) , "mic name", mic.name)
    server.send({'request-type': 'SetVolume','source':mic.name,'volume':parseFloat(val)})
}

changeColor=()=>{
    this.setState({
        clicked0: !this.state.clicked0
    })
}

toggleMic(mic,server){
    server.send({'request-type': 'ToggleMute','source':mic.name})
    this.getMic(server)
}
getMic=(server)=>{
    //get all sources
    server.send({'request-type': 'GetSourcesList'})
    .then(data=>{
            console.log("MY MIC DATA", data.sources)

            const arrayOfMics = []

            //reduce to mics
            data.sources.forEach((val)=>{
                if(val.typeId==="coreaudio_input_capture"){
                    arrayOfMics.push(val)
                }
            })
            let finalArrayOfMics = []
            console.log("MY MIC ARRAY", arrayOfMics)

            //make mic array with name and mute status
            for(let i=0; i<arrayOfMics.length;i++){
                
                server.send({'request-type': 'GetMute','source':arrayOfMics[i].name}).then(data2=>{
                    console.log("fin mic, ",finalArrayOfMics)
                    finalArrayOfMics.push(data2)
                    if(i===arrayOfMics.length-1){
                        console.log("MY FINAL MIC DATA", finalArrayOfMics)
            // this.getVol(finalArrayOfMics,server)
            this.makeDivs(finalArrayOfMics)
                    }
                    
                    // this.setState({
                    //     micArray:finalArrayOfMics
                    // })
                    
                    
                })
            }
            
            
            
            
        // this.setState( { 
        //     scenes: data.scenes,
        //     currentScene:data["current-scene"] 
        // } );

    })
    
}



makeDivs=(mics)=>{
    console.log("MY MICS AS OBJ",mics)
    // mics.reverse()
         let sources = []
        //  let flippedMics = mics.reverse()
         console.log("sources in mics", mics.length, mics)
        for (let i=mics.length-1; i>-1; i--){
            console.log("sources in", sources)
            
            if(mics[i].muted===false){
                this.srcClass = "src-btn-active"
                this.icon = "mic"
            } else {
                this.srcClass = "src-btn-inactive"
                this.icon = "mic_off"
            }
            sources.push(
                <div className={this.srcClass} onClick={(e)=>{ 
                    // this.changeColor()
                    this.toggleMic(mics[i],this.props.server)}} key={i} >
                <div className="label-box" 
                
                    >
                    <div className='label'>{mics[i].name.toUpperCase()}
                    </div>
                </div>
                
                
             
            
            <i className="material-icons" style={{color:"white"}}>
        {this.icon}
        </i>
       
        
        </div>)
        }
        sources.push(<div key={mics.length+1} className="src-btn-active" onClick={()=>{
            this.props.showHide("mixer", true)
        }}>MIXER</div>)
        console.log("vvvv", sources)
        this.setState({
            sourcesDivs:sources
        })

        }
        
        
componentDidUpdate(prev){
    console.log("BBBB", this.props)
    if(this.props.server && prev.server===null){
        console.log("BBBB2", this.props)
        this.getMic(this.props.server)  
        
    }
    if(this.props.event && this.props.event["sc-name"]){
        this.getMic(this.props.server) 
    }
}


componentDidMount(){
    

}
    
        render(){
            console.log("greg")
            return (
            <div className='source-panel'>
                        
                        {this.state.sourcesDivs}

                    </div>
                    )
        }
        
    
    
}
export default SourcePanel