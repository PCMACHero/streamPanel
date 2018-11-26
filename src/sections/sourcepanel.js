import React from 'react';
// import SceneBtn from './scenebtn'
// import {OBSSourcesObj} from '../helpers/dummydata'

const sourcePanel = (props)=>{
    let OBSSourcesObj = props.arr2;
    let myIcon = null;
    let sources = [];
    const sourceMap = {
        'coreaudio_input_capture': 'mic',
        'av_capture_input' : 'videocam'
    }
    for (let i=0; i<OBSSourcesObj.sources.length; i++){

        sources.push(
            <div className="source-btn" key={100+i} onClick={()=>{props.func(OBSSourcesObj.sources[i].name)}}>
    <i className="material-icons">
    {sourceMap[OBSSourcesObj.sources[i].typeId]}
    </i>
        <div className='label'>{OBSSourcesObj.sources[i].name.toUpperCase()}
        </div>
    </div>)
    }
    
    return (<div className='source-panel'>
        {sources}
    </div>)
}
export default sourcePanel