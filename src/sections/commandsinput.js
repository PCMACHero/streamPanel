import React, {Component} from 'react';

import {MyContext, MyProvider} from '../views/streampanel'
import axios from 'axios'

export default class CommandsInput extends Component{
    counter=1
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
                this.showCommands()
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
        

        axios.put(`/spuser/${this.props.context.state.myId}`,{
            _id: this.props.context.state.myId,
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
            this.showCommands()
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

    showCommands = ()=>{
        
        this.commandsToShow = []
        for(let i=0; i<this.dbCommands.length;i++){
            // let index = 1000000
            let makeObj = this.dbCommands[i]
            this.commandsToShow.push(
                
                <div className="command-item" key={i}>
                    <div className="command-name">
                        <div>{makeObj.name}</div>
                    </div>
                    <div className="command-text">"{makeObj.response}"</div>
                    <div className="s1 btn right-align red" onClick={()=>{
                        console.log("clicked to delete: ",makeObj)
                        this.deleteCommand(i)
                        
                        
                        
                        
                        
                        }}>DEL</div>
                </div>

            )
        } 
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


        axios.put(`/spuser/${this.props.context.state.myId}`,{
            _id: this.props.context.state.myId,
            username: this.props.context.state.username,
            commands: this.dbCommands,
            email: this.props.context.state.email,
            partner: this.props.context.state.partner,
        })

        console.log("ADD CLICK", this.dbCommands)
        
        this.setState({
            name:"",
            response:""
        })
        console.log("THIS IS GETLOCALSTORAGECOMMANDS: ", this.getLocalStorageCommands)
        console.log("THIS IS COMMANDTURNEDTOARRAY: ", this.commandsTurnedToArray)
        console.log("THIS IS COMMANDSTOSHOW:", this.commandsToShow)
        this.showCommands()
        
    }
    changeHandler = (event)=>{
        console.log(event.target.value)
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    componentDidMount(){
        
        setTimeout(() => {
            console.log("MY CONTEXT",this.props.context)
            this.getCommandsFromDB(this.props.context.state.myId)   
        }, 500);
        

    }
    render(){
       
        return (
            <div  className="commands-box" 
            // key={this.counter+=5}
            >
            
                <form className="commands-input">
                    <div className="input-field">
                        <input className="input-name" name="name" autoComplete="off" id="name"placeholder="" type="text" onChange={this.changeHandler} value={this.state.name}/>
                        {/* <label for="name">Command Name</label> */}
                    </div>
                    <div className="input-field command-input-text">
                        <input className="input-name" name="response" autoComplete="off" id="response" placeholder={``} type="text" onChange={this.changeHandler} value={this.state.response}/>
                        {/* <label for="response">Command Response</label> */}
                    </div>
                    <div onClick={this.addCommand} className="s1 btn right-align purple" waves='light'>ADD</div>
                </form>
                <div className="commands" >
                    {this.commandsToShow}
                </div>
                
            </div>
        )
    }
}

CommandsInput.contextType = MyContext;