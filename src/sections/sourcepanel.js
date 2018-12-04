import React from 'react';
// import SceneBtn from './scenebtn'
// import {OBSSourcesObj} from '../helpers/dummydata'

const sourcePanel = (props)=> {
        
        
       
       let sources = [];
       let srcClass=null;
       let sourceMap = {
            'coreaudio_input_capture': 'mic',
            'av_capture_input' : 'videocam'
        }
    
     
        const OBSSourcesObj = props.sources;
        console.log(OBSSourcesObj)
         
        for (let i=0; i<OBSSourcesObj.length; i++){
            
            if(OBSSourcesObj[i].render===true){
                srcClass = "src-btn-active"
            } else {
                srcClass = "src-btn-inactive"
            }
            sources.push(
                <div className={srcClass} key={100+i} onClick={()=>{props.func(OBSSourcesObj[i].name)}}>
        <i className="material-icons">
        {sourceMap[OBSSourcesObj[i].type]}
        </i>
            <div className='label'>{OBSSourcesObj[i].name.toUpperCase()}
            </div>
        </div>)
        }
     
    
    
        return (<div className='source-panel'>
        {sources}
    </div>)
    
    
}
export default sourcePanel