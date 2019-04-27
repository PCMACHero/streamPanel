import React from 'react'
import Input from 'react-materialize/lib/Input';
import './alex.css'

export default class Alex extends React.Component{

    state={
        sceneDivs:[],
        timeLineDivs: [],
        timeLine:[],
        timerInput: "",
        message: "Choose a Starting Scene to Create a Timer",
    }

    timerDiv= <input type="text" name="timer" id="timer" value={this.state.timerInput} onChange={(e)=>{
        e.preventDefault()
        this.setState({
            timerInput: e.target.value
        })
        console.log(e.target.value)
    }}/>

    makeTimeLineDivs =(arr)=>{
        let tempArr = []
        for(let i=0; i<arr.length; i++){
            
            if(i % 2 ===0){
                tempArr.push(<div key={i} className="tlScene">{arr[i]}</div>)
            }else{
                tempArr.push(<div key={i} className="tlTime"><i className="material-icons">
                alarm
                </i>{arr[i]}</div>)
            }
            
        }
        this.setState({
            timeLineDivs:tempArr
        })
    }

    makeSceneDivs =(arr)=>{
        let tempArr = []
        for(let i=0; i<arr.length; i++){
            tempArr.push(<div 
                onClick={()=>{
                    this.clickChooseScene(arr[i].name)
                }}
                className="sceneBox" key={i}>{arr[i].name}</div>)
        }
        this.setState({
            sceneDivs:tempArr
        })
    }

    clickChooseScene=(scene)=>{
        console.log("tried to add scene to arr 1")
                    console.log("TL length", this.state.timeLine.length)
                    if(this.state.timeLine.length % 2 === 0){
                        console.log("tried to add scene to arr 2")
                        let TLObj = this.state.timeLine
                        
                        
                        TLObj.push(scene)
                        this.setState({
                            
                            timeLine: TLObj}, ()=>{this.makeTimeLineDivs(this.state.timeLine)})
                    }
    }

    clickAddTimer=(amount)=>{
        if(this.state.timeLine.length % 2 !== 0){
            let tempArr = this.state.timeLine
            tempArr.push(1*amount)
            this.setState({
                timeLine: tempArr,
                timerInput: ""
            },()=>this.makeTimeLineDivs(tempArr))
        }
    }

    done=(obj)=>{
        this.props.context.updateState("alexTimer", obj)
        this.props.context.showHideScreen("all", false)
    }

    componentDidMount(){
        this.makeSceneDivs(this.props.context.state.scenes)
    }

    render(){
        return (
            
            <div className="cont">
                <div className="sceneRow">{this.state.sceneDivs}</div>
                <div className="instText">{this.state.timeLine.length===0?"Choose a Starting Scene to Create a Timer": ""}{this.state.timeLine.length===1?"Choose a Time Length (seconds)": ""}{this.state.timeLine.length===2?"Choose the Scene to Switch to": ""}{this.state.timeLine.length>2?"End with a timer, to make a loop.": ""}</div>
               
                <div className="row">
                    <input className="timerInput" style={{width:"100px"}}type="text" name="timer" id="timer" value={this.state.timerInput} onChange={(e)=>{
                        e.preventDefault()
                        if(isNaN(e.target.value)){
                            
                            return
                        }else{
                            this.setState({
                                timerInput: e.target.value
                            })
                        }
                        
                        console.log(e.target.value)
                    }}/><div className="addTimerBtn"
                    onClick={()=>{
                        this.clickAddTimer(this.state.timerInput)
                        

                    }}
                    >ADD</div>
                </div>
                <div className="row">{this.state.timeLineDivs}</div>
                <div className="done" onClick={()=>{
                    this.done(this.state.timeLine)
                }}>DONE</div>
                
                        </div>
            
        )
    }
}

