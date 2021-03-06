import React, {Component} from 'react';
import {Link} from 'react-router-dom'


// import SceneBtn from './scenebtn'
// import {OBSSceneObj} from '../helpers/dummydata'



class ScenePanel extends Component{

    state= {
        scenes: [],
        divs: [],
        currentScene: {},

    }

    OBSSceneObj = this.state.scenes;
    server = this.props.server
    btnClass = null;
    scenes = [<div key="1" className="animated infinite pulse" 
    style={{fontSize:"1rem", display:"flex", "justifyContent":"center", "alignItems":"center",height:"100%",width:"100%", backgroundColor:"red", }}
    >Cannot Find OBS. Make sure you have installed OBS Websocket, and that OBS is running, then refresh.</div>];
    
    getAndMakeScenesAndSources(server){
        server.send({'request-type': 'GetSceneList'}).then(data=>{
            console.log("IS SERVER WORKING?", data)
            this.makeDivs(data.scenes, data["current-scene"]  )
            this.props.context.updateState("scenes", data.scenes)
            this.setState( { 
                scenes: data.scenes,
                currentScene:data["current-scene"] 
            } )
            
            ;

        });
    }


    setSceneAndSourcesOnClick=(scene)=>{
        //get new current scene and scene sources
        this.props.server.send({'request-type': 'SetCurrentScene', "scene-name": scene})
        this.props.server.send({'request-type': 'GetCurrentScene', "scene-name": scene}).then(data2=>{
           console.log("my server data",data2)
           this.setState({
               currentScene:data2.name,
               sources: data2.sources
           })
            
        })
        //get new scenes array
        this.props.server.send({'request-type': 'GetSceneList'}).then(data=>{
            this.makeDivs(this.state.scenes, data["current-scene"])
            this.setState( { 
                
                currentScene:data["current-scene"],
                
            } );

        })
       }


       getFirstScenesAndSources(){
           console.log("check 1", this.props)
        
        
            this.getAndMakeScenesAndSources(this.props.server)
            // this.getMic()
            
            this.props.server.send({"request-type": "GetStreamingStatus"}).then(data=>{
                console.log("MY STREAM STATUS OBJ", data.streaming)
                this.setState({
                    streamingStatus:data.streaming
                })
            })

            this.props.server.send({'request-type': 'GetCurrentScene'}).then(data2=>{
                
                this.setState( { 
                    sources: data2.sources
                } )});


            // this.props.server.send({'request-type': 'GetMute', source: 'newsub'})
            // this.props.server.send({'request-type': 'ToggleMute', source: "Browser"})
            
            
        

       }  

    handleServerEvent(newEventData){
        
        
        console.log("EVENT FIRED 44", this.props.event);
        
        if(newEventData["update-type"]==="SceneItemVisibilityChanged" || newEventData["update-type"]==="SwitchScenes"){
            this.getFirstScenesAndSources()

        }
        if(newEventData["update-type"]==="StreamStopped"){
            console.log("REEEEEEEEEEE STOPPED")
            this.setState({
                streamingStatus: false,
                statusMessage: null,
            })
            this.getFirstScenesAndSources()
        }else if ( newEventData["update-type"]==="StreamStopping"){
            this.setState({
                statusMessage: "Stream is stopping..."
            })
            this.getFirstScenesAndSources()
        } else if (newEventData["update-type"]==="StreamStarted"){
            console.log("REEEEEEEEEEE STARTED")
            this.setState({
                streamingStatus: true,
                statusMessage: null
            })
            this.getFirstScenesAndSources()
        } else if (newEventData["update-type"]==="StreamStarting"){
            this.setState({
                statusMessage:"Stream is starting..."
            })
            this.getFirstScenesAndSources()
        }
        console.log("THIS DOESNT CHANGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!",this.state.streamingStatus)
        
        
    }

    

    

    makeDivs(sceneArr, current){
        this.scenes = []
        console.log("MAKE DIVS SCENE ARR,", sceneArr)
        let style = null
        if(sceneArr.length<6){
            style = {width:`${100/sceneArr.length}%`}
        } else {
            style = {width:`16.666%`}
        }
        for (let i=0; i<sceneArr.length; i++){
            
            if(current===sceneArr[i].name){
                this.btnClass = "selected-scene-btn"
            } else 
                {this.btnClass = "scene-btn"}
            this.scenes.push(
            <div className={this.btnClass} key={i} style={style} onClick={()=>{this.setSceneAndSourcesOnClick(this.state.scenes[i].name)}}>
                <i className="material-icons">
                {/* {props.icon} */}
                </i>
                    <div className='label'>{sceneArr[i].name.toUpperCase()}
                    </div>
            </div>)
            }
            
    }
    componentDidUpdate(prev){
        console.log("event prop", this.props.event)
        if(prev.context.state.alexTimer !== this.props.context.state.alexTimer){
            let alex = this.props.context.state.alexTimer
            if(alex.length % 2 === 0){
                let loopTime = 0
                alex.forEach((e,i)=>{
                    if(i%2!==0){
                        loopTime+=e
                    }
                })
                let startTime = 0
            this.setSceneAndSourcesOnClick(alex[0])
            for(let i =2; i<alex.length;i+=2){
                startTime+= alex[i-1]
                setTimeout(() => {
                    this.setSceneAndSourcesOnClick(alex[i])
                }, startTime*1000);
            }
                console.log("looptimeis 10",loopTime)
                setInterval(() => {
                    let startTime = 0
            this.setSceneAndSourcesOnClick(alex[0])
            for(let i =2; i<alex.length;i+=2){
                startTime+= alex[i-1]
                setTimeout(() => {
                    this.setSceneAndSourcesOnClick(alex[i])
                }, startTime*1000);
            }
                }, loopTime*1000);
            }else{
                let startTime = 0
            this.setSceneAndSourcesOnClick(alex[0])
            for(let i =2; i<alex.length;i+=2){
                startTime+= alex[i-1]
                setTimeout(() => {
                    this.setSceneAndSourcesOnClick(alex[i])
                }, startTime*1000);
            }
            }
            
            
            
        }
        if(this.props.server && prev.server==undefined){
            console.log("OBS CONNECTED")
            this.getFirstScenesAndSources()  
        }
        if(this.props.event && this.props.event["update-type"]==="SwitchScenes"){
            console.log("SCENE SWITCHED", this.props.event)
            this.getFirstScenesAndSources()   
        }
          
    }
    
    componentDidMount(){
     
        
        
        
    }
    
    render(){
        console.log("eventscene", this.props.event)
        return (<div className='scene-panel' >
        
        {this.scenes}
    </div>)
    }
    
}
export default ScenePanel

