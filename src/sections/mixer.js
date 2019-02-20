import React, {Component, Fragment} from 'react'

export default class Mixer extends Component{

    state={
        divs: []

    }

    changeHandler = (event)=>{
        console.log(event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        })
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
                this.getVol(finalArrayOfMics,server)
                
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

    setVol=(mic,i, val, server)=>{
        console.log("val is",typeof(val) , "mic name", mic.name)
        server.send({'request-type': 'SetVolume','source':mic.name,'volume':parseFloat(val)})
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

    makeDivs=(mics)=>{
        let arr=[]
        for (let i = mics.length-1; i>-1; i--){
            
            arr.push(
                <Fragment>
                    <div className="slide-num">{this.state[`slider${i}`]}</div>
            <input className="slider" type="range" orient="vertical" name={`slider${i}`} min="0.1" max="1" step="0.01" onChange={(e)=>{
                console.log("eve ",e)
                this.changeHandler(e)
                this.setVol(mics[i], i,e.target.value,this.props.server)
            }} 
                // defaultValue="0"
                defaultValue={this.state[`defslider${i}`]} value={this.state[`slider${i}`]}>
            </input>
                </Fragment>
                )
        }
        this.setState({
            divs:arr
        })

    }

    componentDidUpdate(prev){
        console.log("zazu", this.props)
        if(this.props.server && prev.server===null){
            console.log("zaz", this.props)
            this.getMic(this.props.server)  
            
        }
        if(this.props.event && this.props.event["sc-name"]){
            this.getMic(this.props.server) 
        }
    }
    componentDidMount(){
        this.getMic(this.props.server)  
    }
    render(){
        console.log("george", this.props.server)
        return (
            <div className="slider-box">
                {this.state.divs}
            </div>
        )
    }
}