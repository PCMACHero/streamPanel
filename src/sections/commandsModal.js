import React, {Component} from 'react'
import CommandInput from './commandsinput'
import {MyContext, MyProvider} from '../views/streampanel'
import "./modals.css"

export default class CommandsModal extends Component{
render(){
    return(
        <div className="commands-modal">
        
        <MyContext.Consumer>
    {context =>
      
      <CommandInput context={context} />
  
    }
  </MyContext.Consumer>
    </div>
    )
    
    
}
}