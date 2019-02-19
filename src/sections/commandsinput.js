import React, {Component} from 'react';

import {MyContext, MyProvider} from '../views/streampanel'
import axios from 'axios'
import './twitchpanel.css'
import { streamerID } from '../helpers/dummydata';

export default class CommandsInput extends Component{
    counter=1
    oauth = this.props.context.state.myOauth
    id = this.props.context.state.myId
    // counter2=70000
    objForLS = {}
    getLocalStorageCommands = {}
    // commandsTurnedToArray= []
    commandsToShow =[]
    dbCommands = null
    getCommandsFromDB = (id)=>{
        if(!id){
            return
        }else{
            axios.get(`/spuser/${id}`).then(res=>{
                this.dbCommands = res.data.commands
                console.log("MY DB COMMANDS", this.dbCommands)
                // this.getLSObjAndArray()
                // this.commandsTurnedToArray = this.dbCommands
                this.showCommands(res.data.commands)
            })
        }
        
    }
    
    state={
        name:"",
        response: "",
        commands: this.commandsToShow,
        id:null
    }
    deleteCommand(item){
        this.dbCommands.splice(item,1);
        

        axios.put(`/spuser/${this.id}`,{
            _id: this.id,
            username: this.props.context.state.username,
            commands: this.dbCommands,
            email: this.props.context.state.email,
            partner: this.props.context.state.partner,
        }).then(res=>{
            this.dbCommands= res.data.commands
            // this.setState({
            //     name:"",
            //     response:""
            // })
            this.showCommands(res.data.commands)
            this.setState({
                name:"",
                response:""
            })
            
            
        })

        
    }
    // LSArrayToOBj = ()=>{
    //     this.objForLS = {}
    //         console.log("before",this.objForLS)
    //         for (let i=0; i<this.commandsTurnedToArray.length;i++){
    //             this.objForLS[this.commandsTurnedToArray[i][0]] = this.commandsTurnedToArray[i][1];
    //             console.log("this.commandsTurnedToArray", this.commandsTurnedToArray)
    //             console.log("this.getlocalstoarage: ",this.getLocalStorageCommands )
    //         } 
    //         console.log("after",this.objForLS)
    //         localStorage.setItem('commands', JSON.stringify(this.objForLS));

    // }
    // getLSObjAndArray = ()=>{
    //     this.getLocalStorageCommands= JSON.parse(localStorage.getItem('commands'));
    //     //  this.commandsTurnedToArray= Object.entries(JSON.parse(localStorage.getItem('commands')))
    //     // this.commandsTurnedToArray= Object.entries(JSON.parse(this.dbCommands))
    // }

    showCommands = (commands)=>{
        
        this.commandsToShow = []
        console.log("commands in show", commands)
        for(let i=0; i<commands.length;i++){
            // let index = 1000000
            let makeObj = commands[i]
            this.commandsToShow.push(
                
                <div className="command-item" key={i}>
                    <div className="command-name">
                        <div>{makeObj.name}</div>
                    </div>
                    <div className="command-text">"{makeObj.response}"</div>
                    <div className="btn del " onClick={()=>{
                        console.log("clicked to delete: ",makeObj)
                        this.deleteCommand(i)
                        
                        
                        
                        
                        
                        }}>DEL</div>
                </div>

            )
        } this.setState({
            commands:this.commandsToShow
        })
    }
    // checkIfLSEmpty = ()=>{
    //     if(JSON.parse(localStorage.getItem('commands'))){
    //         this.getLocalStorageCommands = JSON.parse(localStorage.getItem('commands'));
    //         this.commandsTurnedToArray= Object.entries(this.getLocalStorageCommands);
    //     } else {
    //         this.getLocalStorageCommands = {}
    //         this.commandsTurnedToArray = []
    //     }

    // }
   
    addCommand = ()=>{
        let commandToAdd = {name:this.state.name, response: this.state.response}
        // this.commandsTurnedToArray.push(this.dbCommands)
        this.dbCommands.push(commandToAdd)


        axios.put(`/spuser/${this.id}`,{
            _id: this.id,
            username: this.props.context.state.username,
            commands: this.dbCommands,
            email: this.props.context.state.email,
            partner: this.props.context.state.partner,
        }).then(res=>{
            console.log("ADD CLICK", this.dbCommands)
        
        this.setState({
            name:"",
            response:""
        })
        console.log("THIS IS GETLOCALSTORAGECOMMANDS: ", this.getLocalStorageCommands)
        console.log("THIS IS COMMANDTURNEDTOARRAY: ", this.commandsTurnedToArray)
        console.log("THIS IS COMMANDSTOSHOW:", this.commandsToShow)
        this.showCommands(res.data.commands)
        }

        )

        
        
    }
    changeHandler = (event)=>{
        console.log(event.target.value)
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    componentDidMount(){
        console.log("commands context", this.props.context)
        
            
            this.getCommandsFromDB(this.id)   
        
        

    }
    render(){
       
        return (
            <div  className="commands-box">
                <div className="modal-title">COMMAND MAKER</div>
                <form className="commands-input">
                <div className="input-pair">
                <div className="input-field">
                    
                    <input className="input-name" name="name" autoComplete="off" id="name"placeholder="" type="text" onChange={this.changeHandler} value={this.state.name}/>
                    {/* <label for="name">Command Name</label> */}
                </div>
                <div className="input-field command-input-text">
                    <input className="input-name" name="response" autoComplete="off" id="response" placeholder={``} type="text" onChange={this.changeHandler} value={this.state.response}/>
                    {/* <label for="response">Command Response</label> */}
                </div>
                </div>
                    
                    <div className="btn-box"><div onClick={this.addCommand} className="btn" waves='light'>ADD</div></div>
                    
                </form>
                <div className="commands" >
                    {this.commandsToShow}
                </div>
                
            </div>
        )
    }
}

// CommandsInput.contextType = MyContext;