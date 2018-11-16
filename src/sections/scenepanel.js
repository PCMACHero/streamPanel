import React from 'react';
import SceneBtn from './scenebtn'
import {OBSSceneObj} from '../helpers/dummydata'

const scenePanel = ()=>{
    let scenes = [];
    for (let i=0; i<OBSSceneObj.scenes.length; i++){
        scenes.push(<SceneBtn name={OBSSceneObj.scenes[i].name}/>)
    }
    let scene1="hello"
    return (<div className='scene-panel'>
        {scenes}
    </div>)
}
export default scenePanel