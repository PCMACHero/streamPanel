import React from 'react'
import {clientID} from '../../common/common'
import {Row, Autocomplete} from 'react-materialize'
import "./updatemodal.css"

import axios from 'axios'

export default class Update extends React.Component{
    
    state={
        currentGame: this.props.context.state.game,
        newGame:"",
        newGameAC: "",
        currentTitle:this.props.context.state.title,
        newTitle:"",
        gameCover:"",
        gameToSend:null,
        getText:null,
        line1:"",
        line2:"",
        counterNum:"",
        // gamesList:
        
    }
    getGameCover=(game)=>{
        if(game){
            axios.get("https://api.twitch.tv/helix/games?name="+game,this.headers).then(data=>{
        console.log("game cover game---->", game)  
        console.log("game cover data---->", data.data.data)  
        
            let boxURL = data.data.data[0].box_art_url.split("")
                boxURL.splice(boxURL.length-20)
                let boxURL2 = boxURL.join("")+"450x600.jpg"

                
        
        this.setState({
                gameCover:boxURL2
            })
        
        
        })
        } else {
            let noGame = "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg"
            this.setState({
                gameCover:noGame
            })
        }
        
    }
    // getGamesList=()=>{
    //     let tempList={}
    //     for(let i=0; i<bigGameList.length; i++){
            
    //            let boxURL = bigGameList[i].box_art_url.split("")
    //            boxURL.splice(boxURL.length-20)
    //            let boxURL2 = boxURL.join("")+"150x200.jpg"
               
    //            tempList[bigGameList[i].name]=boxURL2
               
    //     }

    //        this.setState({
    //            gamesList:tempList
    //        })
    //        console.log("MY 100 GAMES DATA:", (bigGameList))
           
    //        }
    getGameToSend=()=>{
        if(this.state.newGameAC){
            return this.state.newGameAC
        }else if (this.state.newGame){
            return this.state.newGame
        } else {
            return this.state.currentGame
        }
    }
    changeHandler = (event)=>{
        
        this.setState({
            newTitle: event.target.value
        })
        
    }
    changeGameHandler = (event)=>{
        
        
        this.setState({
            newGame: event.target.value
        })
        
    }
    changeLines=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    changeGameHandlerAC = (val)=>{
        
        this.setState({
            newGameAC: val
        })
        
    }

    getText=()=>{
        this.props.context.state.OBSServer.send({
            "request-type": "GetTextFreetype2Properties",
            "source": "counterSP"
        }).then(data=>{
            console.log("MY TEXT DATA", data)
        })
    }

    setText=()=>{
        console.log("here here")
        this.props.context.updateState("OBSCounterLine1",this.state.line1) 
        this.props.context.updateState("OBSCounter",Number(this.state.counterNum)) 
        this.props.context.updateState("OBSCounterLine2",this.state.line2) 
        
        
        
        let string = `${this.state.line1===""?"":this.state.line1 + " "} ${this.state.counterNum} ${this.state.line2===""?"": " " + this.state.line2}`
        this.props.context.state.OBSServer.send({
            "request-type": "SetTextFreetype2Properties",
            "source": "counterSP",
            "text":string
        })
    }

    componentDidUpdate(prev){
        console.log("did update update prev", prev)
        console.log("did update update props", this.props)
    }

    componentDidMount(){
        document.getElementById("newGame").setAttribute("autocomplete", "off");
        // this.getGamesList()
    }
    render(){
        return (
            <React.Fragment>

            
            <form className="commands-input">
            
                        <Row>
                            <Autocomplete
                                
                                limit={4}
                                minLength={3}
                                // m={12}
                                onChange={(e)=>this.changeGameHandler(e)}
                                onAutocomplete={(val)=>{
                                    this.changeGameHandlerAC(val)
                                   }}
                                value={this.state.newGameAC? this.state.newGameAC : this.state.newGame}
                                
                                // title='Update Game/Category'
                                className="input-name"
                                data={this.props.context.state.gamesList}
                                name="newGame"
                                id="newGame"
                                placeholder={`Enter Game/Category: ${this.props.context.state.game}`}
                                
                                
                                
                                
                                
                                
                            />
                            
                        </Row>
                        
                        <div className="input-field command-input-text">
                            <input className="input-name" name="newTitle" autoComplete="off" id="new-title"placeholder={`Enter Title ex: ${this.props.context.state.title}`} 
                            type="text" onChange={(e)=>this.changeHandler(e)} value={this.state.newTitle}/>
                            
                        </div>
                        

                    </form>

                    



                
                <div onClick={()=>{
                    // let title = null
                    // if(this.state.newTitle===""){
                    //     title = this.state.currentTitle
                    // } else {
                    //     title = this.state.newTitle
                    // }

                    // let game = null
                    // if(this.state.newGame===""){
                    //     title = this.state.currentGame
                    // } else {
                    //     title = this.state.newGame
                    // }
                            console.log("MY OAUTH IN PUT", this.props.context.state.myOauth)
                            console.log("MY NEWGAME", this.state.newGameAC? this.state.newGameAC: this.state.newGame)
                    axios({
                        method: 'put', //you can set what request you want to be
                        url: 'https://api.twitch.tv/kraken/channels/'+this.props.context.state.twitchId,
                        data: {"channel": {"status": this.state.newTitle? this.state.newTitle: this.state.currentTitle, "game": this.getGameToSend()}},
                        headers: {
                            "Accept": "application/vnd.twitchtv.v5+json",
                            "Client-ID": clientID,
                            // "Authorization": 'OAuth ' + "xp5b0vv17q14ue9l0zw9x8hpreznkn",
                            "Authorization": 'OAuth ' + this.props.context.state.myOauth,
                            // this.props.channelOBJ.oauth,
                            'Content-Type': 'application/json'
                        }
                      }).then(data=>{
                          this.props.context.updateStatus(data.data.game,data.data.status)
                        this.setState({
                            newGame:"2",
                            newTitle:"",
                            currentGame:data.data.game,
                            currentTitle:data.data.status
                        })
                        console.log("MY CURRENT GAME:", this.state.currentGame)
                        this.getGameCover(this.state.currentGame)
                      })
                      
                      
                      
                      
                }} className="s1 btn right-align #4a148c purple darken-4" waves='light'>Update</div>

                <div className="btn" onClick={()=>{this.getText()}}>GETTEXT</div>
                
                    <form action="" style={{display:"flex", justifyContent:"space-evenly", width:"700px"}}>
                        <input type="text" style={{width:"150px"}} name="line1" id="line1" value={this.state.line1} autoComplete="off" onChange={(e)=>{this.changeLines(e)}}/>
                        <input type="text" style={{width:"30px"}} name="counterNum" id="counterNum" value={this.state.counterNum} autoComplete="off" onChange={(e)=>{this.changeLines(e)}}/>
                        <input type="text" style={{width:"150px"}} name="line2" id="line2" value={this.state.line2} autoComplete="off" onChange={(e)=>{this.changeLines(e)}}/>
                        
                        <div className="btn" onClick={()=>{this.setText()}}>SEND</div>
                    </form>
                
                
                
                </React.Fragment>
        )
    }
}