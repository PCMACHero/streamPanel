import React from 'react';
import SceneBtn from './scenebtn'
import {OBSSourcesObj} from '../helpers/dummydata'

const sourcePanel = ()=>{
    let sources = [];
    for (let i=0; i<OBSSourcesObj.sources.length; i++){
        sources.push(<SceneBtn name={OBSSourcesObj.sources[i].name}/>)
    }
    let scene1="hello"
    return (<div className='scene-panel'>
        {sources}
    </div>)
}
export default sourcePanel