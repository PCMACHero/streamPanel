import React from 'react';
import SceneBtn from './scenebtn'
import {OBSSceneObj} from '../helpers/dummydata'



const scenePanel = ()=>{

    

    let scenes = [];
    for (let i=0; i<OBSSceneObj.scenes.length; i++){
        scenes.push(<SceneBtn styling="scene-btn" name={OBSSceneObj.scenes[i].name.toUpperCase()} key={i} onClick={()=>{
            console.log("clicked")
        }}/>)
    }
    
    return (<div className='scene-panel'>
        {scenes}
    </div>)
}
export default scenePanel