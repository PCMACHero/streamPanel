import React, {Component} from 'react';
// import Slider from 'react-materialize/lib/Slider';
// import SceneBtn from './scenebtn'
// import {OBSSourcesObj} from '../helpers/dummydata'

class SourcePanel extends Component {
        
        state = {
            
            sources:[]
        }
        server = this.props.server
        icon =null
        sources = [];
        srcClass=null;
        sourceMap = {
            'coreaudio_input_capture': 'mic',
            'av_capture_input' : 'videocam'
        }

        changeHandler = (event)=>{
            console.log(event.target.value)
            
            this.setState({
                [event.target.name]: event.target.value
            })
            
        }
getSources(){

}  
toggleMic(mic,server){
    server.send({'request-type': 'ToggleMute','source':mic.name})
    this.getMic(server)
}
getMic(server){
    server.send({'request-type': 'GetSourcesList'})
    .then(data=>{
            console.log("MY MIC DATA", data.sources)

            const arrayOfMics = []
            data.sources.forEach((val)=>{
                if(val.typeId==="coreaudio_input_capture"){
                    arrayOfMics.push(val)
                }
            })
            const finalArrayOfMics = []
            console.log("MY MIC ARRAY", arrayOfMics)
            for(let i=0; i<arrayOfMics.length;i++){
                
                server.send({'request-type': 'GetMute','source':arrayOfMics[i].name}).then(data2=>{
                    console.log("DATA2, ",data2)
                    finalArrayOfMics.push(data2)
                    this.makeDivs(finalArrayOfMics)
                    this.setState({
                        sources:finalArrayOfMics
                    })
                    
                })
            }
            console.log("MY FINAL MIC DATA", finalArrayOfMics)
            
            
        // this.setState( { 
        //     scenes: data.scenes,
        //     currentScene:data["current-scene"] 
        // } );

    })
    
}

toggleSource = (sourceToToggle)=>{
    
    this.server.send({'request-type': 'GetCurrentScene'}).then(data=>{
        console.log("sources before click change", data.sources)
        for(let i = 0; i < data.sources.length; i++){
            
            if (data.sources[i].name === sourceToToggle){
                
                let toggle = !data.sources[i].render
                console.log(toggle)
                
                //toggle visibility
                this.server.send({'request-type': 'SetSceneItemProperties',"item": sourceToToggle, "visible": toggle})
                
                
                
            } 
            
        } this.getMic(this.props.server)
        
        
    })

        //    console.log("CLIECKED ROUCES :", source)
        //    this.server.send({'request-type': 'GetSourceSettings',"sourceName": source}).then(data=>{
        //        console.log("SDJKDFJKDJGKJGKJGFKG",data)
        //    })
        
        

       }

makeDivs(mics, cams){
    console.log("MY MICS AS OBJ",mics)
    // mics.reverse()
         this.sources = []
        for (let i=0; i<mics.length; i++){
            
            if(mics[i].muted===false){
                this.srcClass = "src-btn-active"
                this.icon = "mic"
            } else {
                this.srcClass = "src-btn-inactive"
                this.icon = "mic_off"
            }
            this.sources.unshift(
                <div className={this.srcClass} key={i} onClick={()=>{this.toggleMic(mics[i],this.props.server)}}>
                
                
             
            <div className='label'>{mics[i].name.toUpperCase()}
            </div>
            <i className="material-icons" style={{color:"white"}}>
        {this.icon}
        </i>
        <input type="range" name={`slider${i}`} min="1" max="100" onChange={(e)=>this.changeHandler(e)} value={this.state[`slider${i}`]}></input>
        </div>)
        }

        }
        
        
componentDidUpdate(prev){
    console.log("BBBB", this.props)
    if(this.props.server && prev.server===null){
        console.log("yyy",prev.server)
        console.log("ttt",this.props.server)
        this.getMic(this.props.server)  
    }
    if(this.props.event && this.props.event["sc-name"]){
        console.log("FFFF", this.props.event)
        this.getMic(this.props.server) 
    }
}


componentDidMount(){
    

}
    
        render(){
            return (<div className='source-panel'>
                        
                        {this.sources}
                    </div>)
        }
        
    
    
}
export default SourcePanel