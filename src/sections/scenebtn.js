import React from 'react';


const sceneBtn = (props)=>{
    
    return (<div className={props.styling} onClick={()=>{console.log("clicked",props.name)}}><i className="material-icons">
    {props.icon}
    </i>
        <div className='label'>{props.name}
        </div>
    </div>)
}
export default sceneBtn