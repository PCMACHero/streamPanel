import React, {Component} from 'react';
import Obs from '../helpers/obs-server.js';
// import SceneBtn from './scenebtn'
// import {OBSSceneObj} from '../helpers/dummydata'



const scenePanel = (props)=>{

    let OBSSceneObj = props.arr;
    let btnClass = null;
    let scenes = [];
    for (let i=0; i<OBSSceneObj.scenes.length; i++){
        if(props.currentScene===OBSSceneObj.scenes[i].name){
            btnClass = "selected-scene-btn"
        } else 
            {btnClass = "scene-btn"}
        scenes.push(
        <div className={btnClass} key={i} onClick={()=>
        {console.log("clicked",OBSSceneObj.scenes[i].name.toUpperCase())}}>
            <i className="material-icons">
            {props.icon}
            </i>
                <div className='label'>{OBSSceneObj.scenes[i].name.toUpperCase()}
                </div>
        </div>)
        }
    
    
    return (<div className='scene-panel'>
        {scenes}
    </div>)
}
export default scenePanel