import React, {Component} from 'react';

import {MyContext, MyProvider} from '../views/streampanel'
import axios from 'axios'
import './twitchpanel.css'
import { streamerID } from '../helpers/dummydata';

export default class CommandsInput extends Component{

    state={
        name:"",
        reply: "",
        commands: null,
        id:null
    }



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



            axios.post(`/api/getuserinfo/`).then(res=>{
                console.log("my greek", res)
                let commands = res.data.data.custom
                // this.setState({
                //     commands:commands
                // })
                this.showCommands(commands)
            })




        }
        
    }
    
    
    deleteCommand(i){
        // this.dbCommands.splice(index,1);
        

        axios.delete(`/api/command/`,{data:{index:i}}).then(res=>{

            // this.dbCommands= res.data.commands
            console.log("delete ",res)
            // this.setState({
            //     name:"",
            //     reply:""
            // })
            // this.showCommands(res.data.commands)
            this.getCommandsFromDB(this.id) 
            this.setState({
                name:"",
                reply:""
            })
            
            
        }).catch((error) => {
            console.log('Not good man :(');
        })

        
    }

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
                    <div className="command-text">"{makeObj.reply}"</div>
                    <div className="btn del " onClick={()=>{
                        console.log("clicked to delete: ",makeObj)
                        this.deleteCommand(i)
                        
                        
                        
                        
                        
                        }}>DEL</div>
                </div>

            )
        } 
        this.props.context.updateState("commands", commands)
        this.setState({
            commands:commands
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
        // let commandToAdd = {name:this.state.name, reply: this.state.reply}
        // this.commandsTurnedToArray.push(this.dbCommands)
        // this.dbCommands.push(commandToAdd)

        console.log("loaded new command 1")
        axios.post("/api/newcommand",{name:this.state.name, reply:this.state.reply}).then(data=>{
            console.log("loaded new command2")
            console.log("loaded new command3", data)
            this.setState({
                name:"",
                reply:""
            })
            this.showCommands(data.data.data)   
            // this.showCommands(res.data.commands)

        })
    
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
                    <input className="input-name" name="reply" autoComplete="off" id="reply" placeholder={``} type="text" onChange={this.changeHandler} value={this.state.reply}/>
                    {/* <label for="reply">Command reply</label> */}
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