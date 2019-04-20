import React, {Component} from 'react'
import CommandInput from './commandsinput'
import {MyContext} from '../helpers/provider'
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