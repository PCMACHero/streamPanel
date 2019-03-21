import React from 'react'
import {clientID} from '../../common/common'
import {Row, Autocomplete} from 'react-materialize'
import bigGameList from '../../helpers/gamelist'
import axios from 'axios'

export default class Update extends React.Component{
    gamesList={}
    state={
        currentGame: "",
        newGame:"",
        currentTitle:"",
        newTitle:"",
        gameCover:"",
        
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
    getGamesList=()=>{
        for(let i=0; i<bigGameList.length; i++){
               let boxURL = bigGameList[i].box_art_url.split("")
               boxURL.splice(boxURL.length-20)
               let boxURL2 = boxURL.join("")+"150x200.jpg"
               
               this.gamesList[bigGameList[i].name]=boxURL2
               //add to DB
        }

           
           console.log("MY 100 GAMES DATA:", (bigGameList))
           //static game list until build list to mongo
           // axios({
           
           //     url: '/twitchgames',
           //     method: 'post',
           //     "headers": {
           //         "Content-Type": "application/json",
                   
           //                 },
           //     "data": {
           //         "list": bigGameList
           //             }
           //   })
           
           }
    changeHandler = (event)=>{
        console.log(event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    componentDidMount(){
        this.getGamesList()
    }
    render(){
        return (
            <React.Fragment>

            
            <form className="commands-input">
                        <Row>
                            <Autocomplete
                                limit={10}
                                minLength={2}
                                m={12}
                                onChange={(e)=>this.changeHandler(e)}
                                onAutocomplete={(e)=>{
                                    console.log("console log e",e)
                                    this.setState({
                                    
                                    newGame:e
                                })}}
                                // autocomplete="off"
                                // title='Update Game/Category'
                                className="input-name"
                                data={this.gamesList}
                                name="newGame"
                                id="newGame"
                                placeholder="Enter Game/Category"
                                
                                
                                
                                
                                
                                
                            />
                            
                        </Row>
                        {/* <div className="input-field">
                            <input className="input-name" name="newGame" autoComplete="off" data={this.gamesList} id="new-game"placeholder={`Current: ${this.props.channelOBJ.game}`} type="text" onChange={this.changeHandler} value={this.state.newGamePlaying}/>
                            <label for="new-name">Update Game</label>
                        </div> */}
                        <div className="input-field command-input-text">
                            <input className="input-name" name="newTitle" autoComplete="off" id="new-title"placeholder={`Enter Title ex: ${this.state.currentTitle}`} type="text" onChange={(e)=>this.changeHandler(e)} value={this.state.newTitle}/>
                            {/* <label for="new-title">Update Title</label> */}
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
                    axios({
                        method: 'put', //you can set what request you want to be
                        url: 'https://api.twitch.tv/kraken/channels/'+this.props.context.state.myId,
                        data: {"channel": {"status": "test", "game": this.state.newGame}},
                        headers: {
                            "Accept": "application/vnd.twitchtv.v5+json",
                            "Client-ID": clientID,
                            // "Authorization": 'OAuth ' + "xp5b0vv17q14ue9l0zw9x8hpreznkn",
                            "Authorization": 'OAuth ' + this.props.context.state.myOauth,
                            // this.props.channelOBJ.oauth,
                            'Content-Type': 'application/json'
                        }
                      }).then(data=>{
                        this.setState({
                            newGame:"",
                            newTitle:"",
                            currentGame:data.data.game,
                            currentTitle:data.data.status
                        })
                        console.log("MY CURRENT GAME:", this.state.currentGame)
                        this.getGameCover(this.state.currentGame)
                      })
                      
                      
                      
                      
                }} className="s1 btn right-align #4a148c purple darken-4" waves='light'>Update</div>
                </React.Fragment>
        )
    }
}