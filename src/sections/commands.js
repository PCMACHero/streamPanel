import React, {Component} from 'react';
import CommandInput from './commandsinput'

export default class Commands extends Component{
    render(){
        return (
            <div className="commands-container">
                <CommandInput/>
            </div>
        )
    }
}