import React, {Component} from 'react';
import CommandInput from './commandsinput'
import {MyContext, MyProvider} from '../views/streampanel'

export default class Commands extends Component{
    
    render(){
        return (

    <MyContext.Consumer>
    {context =>
      <div className="commands-container">
      <CommandInput context={context} />
  </div>
    }
  </MyContext.Consumer>
            
        )
    }
}