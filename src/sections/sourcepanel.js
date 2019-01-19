import React from 'react';
// import SceneBtn from './scenebtn'
// import {OBSSourcesObj} from '../helpers/dummydata'

const sourcePanel = (props)=> {
        
        
       let icon =null
       let sources = [];
       let srcClass=null;
       let sourceMap = {
            'coreaudio_input_capture': 'mic',
            'av_capture_input' : 'videocam'
        }
    
        
        const OBSSourcesObj = props.sources;
        
        console.log("MY SOURCES AS OBJ",OBSSourcesObj)
         
        for (let i=0; i<OBSSourcesObj.length; i++){
            
            if(OBSSourcesObj[i].render===true){
                srcClass = "src-btn-active"
                icon = "visibility"
            } else {
                srcClass = "src-btn-inactive"
                icon = "visibility_off"
            }
            sources.push(
                <div className={srcClass} key={100+i} onClick={()=>{props.func(OBSSourcesObj[i].name)}}>
        
            <div className='label'>{OBSSourcesObj[i].name.toUpperCase()}
            </div>
            <i className="material-icons" style={{color:"white"}}>
        {icon}
        </i>
        </div>)
        }
     
    
    
        return (<div className='source-panel'>
        {sources}
    </div>)
    
    
}
export default sourcePanel