import React from 'react';
import SceneBtn from './scenebtn'
import {OBSSourcesObj} from '../helpers/dummydata'

const sourcePanel = ()=>{
    let myIcon = null;
    let sources = [];
    const sourceMap = {
        'coreaudio_input_capture': 'mic',
        'av_capture_input' : 'videocam'
    }
    for (let i=0; i<OBSSourcesObj.sources.length; i++){

        sources.push(<SceneBtn styling="source-btn" name={OBSSourcesObj.sources[i].name.toUpperCase()} icon={sourceMap[OBSSourcesObj.sources[i].typeId]} key={100+i}/>)
    }
    
    return (<div className='source-panel'>
        {sources}
    </div>)
}
export default sourcePanel