import React, {Component} from 'react';
import CommandInput from './commandsinput'

export default class Commands extends Component{
    counter=0
    render(){
        return (
            <div className="commands-container">
                <CommandInput key={this.counter+=1}/>
            </div>
        )
    }
}