import React, {Component} from 'react';
import {Button} from 'react-materialize'

export default class CommandsInput extends Component{
    counter=0
    objForLS = {}
    getLocalStorageCommands = {}
    commandsTurnedToArray= []
    commandsToShow =[]
    
    state={
        name:"",
        response: "",
        commands: this.commandsToShow
    }
    deleteCommand(item){
        this.commandsTurnedToArray.splice(item,1);
        this.LSArrayToOBj();
        this.getLSObjAndArray();
        let obj = {}
        for (let i=0; i<this.commandsTurnedToArray.length;i++){
            obj[this.commandsTurnedToArray[i][0]] = this.commandsTurnedToArray[i][1];
            
        } 
        localStorage.clear()
        localStorage.setItem('commands', JSON.stringify(obj));
        this.getLocalStorageCommands= JSON.parse(localStorage.getItem('commands'));
        this.commandsTurnedToArray= Object.entries(JSON.parse(localStorage.getItem('commands')))
        this.setState({
            name:"",
            response:""
        })
        console.log("THIS IS GETLOCALSTORAGECOMMANDS: ", this.getLocalStorageCommands)
        console.log("THIS IS COMMANDTURNEDTOARRAY: ", this.commandsTurnedToArray)
        console.log("THIS IS COMMANDSTOSHOW:", this.commandsToShow)
        this.showCommands()
    }
    LSArrayToOBj = ()=>{
        this.objForLS = {}
            console.log("before",this.objForLS)
            for (let i=0; i<this.commandsTurnedToArray.length;i++){
                this.objForLS[this.commandsTurnedToArray[i][0]] = this.commandsTurnedToArray[i][1];
                console.log("this.commandsTurnedToArray", this.commandsTurnedToArray)
                console.log("this.getlocalstoarage: ",this.getLocalStorageCommands )
            } 
            console.log("after",this.objForLS)
            localStorage.setItem('commands', JSON.stringify(this.objForLS));

    }
    getLSObjAndArray = ()=>{
        this.getLocalStorageCommands= JSON.parse(localStorage.getItem('commands'));
         this.commandsTurnedToArray= Object.entries(JSON.parse(localStorage.getItem('commands')))
    }

    showCommands = ()=>{
        this.commandsToShow = []
        for(let i=0; i<this.commandsTurnedToArray.length;i++){
            let index = 0
            
            this.commandsToShow.push(
                
                <div className="command-item" key={index+=1}>
                    <div className="command-name">
                        <div>{this.commandsTurnedToArray[i][0]}</div>
                    </div>
                    <div className="command-text">"{this.commandsTurnedToArray[i][1]}"</div>
                    <div className="s1 btn right-align red" onClick={()=>{
                        console.log("clicked to delete: ",this.commandsTurnedToArray[i])
                        this.deleteCommand(i)
                        
                        
                        
                        
                        
                        }}>DEL</div>
                </div>

            )
        } 
    }
    checkIfLSEmpty = ()=>{
        if(JSON.parse(localStorage.getItem('commands'))){
            this.getLocalStorageCommands = JSON.parse(localStorage.getItem('commands'));
            this.commandsTurnedToArray= Object.entries(this.getLocalStorageCommands);
        } else {
            this.getLocalStorageCommands = {}
            this.commandsTurnedToArray = []
        }

    }
   
    addCommand = ()=>{
        let commandToAdd = [this.state.name,this.state.response]
        
        this.commandsTurnedToArray.push(commandToAdd)
        
        // console.log(this.commandsTurnedToArray)
        //make array into OBJ to send to local storage
        let obj = {}
        for (let i=0; i<this.commandsTurnedToArray.length;i++){
            obj[this.commandsTurnedToArray[i][0]] = this.commandsTurnedToArray[i][1];
            
        } 
        localStorage.clear()
        localStorage.setItem('commands', JSON.stringify(obj));
        this.getLocalStorageCommands= JSON.parse(localStorage.getItem('commands'));
        this.commandsTurnedToArray= Object.entries(JSON.parse(localStorage.getItem('commands')))
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
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    componentDidMount(){
        this.checkIfLSEmpty()
        this.showCommands()
        
        

    }
    render(){
       this.counter+=10
        return (
            <div className="commands-box" key={this.counter+=5}>
                <form className="commands-input">
                    <div className="input-field">
                        <input className="input-name" name="name" autoComplete="off" id="name"placeholder="example: !PSN" type="text" onChange={this.changeHandler} value={this.state.name}/>
                        {/* <label for="name">Command Name</label> */}
                    </div>
                    <div className="input-field command-input-text">
                        <input className="input-name" name="response" autoComplete="off" id="response" placeholder={`"My PSN is StreamPanelApp"`} type="text" onChange={this.changeHandler} value={this.state.response}/>
                        {/* <label for="response">Command Response</label> */}
                    </div>
                    <div onClick={this.addCommand} className="s1 btn right-align purple" waves='light'>ADD</div>
                </form>
                <div className="commands" key={this.counter+=2}>
                    {this.commandsToShow}
                </div>
                
            </div>
        )
    }
}