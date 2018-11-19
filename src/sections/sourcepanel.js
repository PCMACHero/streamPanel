import React from 'react';
import SceneBtn from './scenebtn'
import {OBSSourcesObj} from '../helpers/dummydata'

const sourcePanel = ()=>{
    let myIcon = null;
    let sources = [];
    for (let i=0; i<OBSSourcesObj.sources.length; i++){
        if(OBSSourcesObj.sources[i].typeId === 'coreaudio_input_capture'){
            myIcon = "mic"
        } else if (OBSSourcesObj.sources[i].typeId==="av_capture_input"){
            myIcon = "videocam"
        } else {
            myIcon = null;
        }
        sources.push(<SceneBtn styling="source-btn" name={OBSSourcesObj.sources[i].name.toUpperCase()} icon={myIcon} key={100+i}/>)
    }
    
    return (<div className='source-panel'>
        {sources}
    </div>)
}
export default sourcePanel