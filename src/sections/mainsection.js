import React from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';
import {streamer} from "../helpers/dummydata"

const mainSection = ()=>{
    return <div className='main-section'>
    <ScenePanel/>
<div className="mid-section"><SourcePanel/>
    <VideoBox channel={streamer}></VideoBox></div>
    </div>
}
export default mainSection