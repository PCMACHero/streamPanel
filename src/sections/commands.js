import React, {Component} from 'react';
import CommandInput from './commandsinput'
import {MyContext} from '../helpers/provider'

export default class Commands extends Component{
    
    render(){
        return (

    <MyContext.Consumer>
    {context =>
      <div className="modal-back">
      <CommandInput context={context} />
  </div>
    }
  </MyContext.Consumer>
            
        )
    }
}