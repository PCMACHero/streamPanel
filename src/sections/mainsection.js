import React from 'react';
import VideoBox from '../sections/videobox/videobox';
import ScenePanel from './scenepanel';
import SourcePanel from './sourcepanel';

const mainSection = ()=>{
    return <div className='main-section'>
    <ScenePanel/>
    <SourcePanel/>
    <VideoBox channel="shroud"></VideoBox>
    </div>
}
export default mainSection