import React from 'react';
// import SceneBtn from './scenebtn'
// import {OBSSceneObj} from '../helpers/dummydata'



const scenePanel = (props)=>{



    let OBSSceneObj = props.scenes;
    
    let btnClass = null;
    let scenes = [];
    for (let i=0; i<OBSSceneObj.length; i++){
        if(props.currentScene===OBSSceneObj[i].name){
            btnClass = "selected-scene-btn"
        } else 
            {btnClass = "scene-btn"}
        scenes.push(
        <div className={btnClass} key={i} onClick={()=>{props.func(OBSSceneObj[i].name)}}>
            <i className="material-icons">
            {props.icon}
            </i>
                <div className='label'>{OBSSceneObj[i].name.toUpperCase()}
                </div>
        </div>)
        }
    
    
    return (<div className='scene-panel'>
        {scenes}
    </div>)
}
export default scenePanel