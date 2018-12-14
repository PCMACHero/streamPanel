import React, {Component} from 'react';
import axios from "axios"
import {clientID} from '../common/common'
import {streamer} from '../helpers/dummydata'
import {Modal, Row, Autocomplete} from 'react-materialize'
import { setInterval } from 'timers';

class ChannelStatus extends Component{
    gamesList={}
    headers={headers:{
        "Client-ID": clientID,
    }}
    state={
        currentGame: null,
        newGame:null,
        currentTitle:null,
        newTitle:null,
    }
    ChannelData = this.props.data
    
    changeHandler = (event)=>{
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    getGamesList=()=>{
        axios.get("https://api.twitch.tv/helix/games/top?first=100",this.headers).then(data=>{
            
            
            for(let i=0; i<data.data.data.length; i++){
                let boxURL = data.data.data[i].box_art_url.split("")
                boxURL.splice(boxURL.length-20)
                let boxURL2 = boxURL.join("")+"150x200.jpg"

                this.gamesList[data.data.data[i].name]=boxURL2
            }
            console.log("MY 100 GAMES DATA:", this.gamesList)
        })

        
    }
    componentDidMount(){
        this.getGamesList()
        
        // console.log("weeeeeeeeeeeeee",this.ChannelData)
    }
    render(){
        return(
            <Modal className="commands-modal"
                header='Update Channel'
                trigger={<div className="channel-status-box">
                            <div className="game-playing">{this.props.channelOBJ.game}</div>
                            <div className="channel-title">"{this.props.channelOBJ.status}"</div>
                        </div>}>
                        
                    <form className="commands-input">
                        <Row>
                            <Autocomplete
                            
                                onChange={this.changeHandler}
                                onAutocomplete={(e)=>{this.setState({
                                    newGame:e
                                })}}

                                title='Update Game/Category'
                                className="input-name"
                                data={this.gamesList}
                                name="newGame"
                                id="newGame"
                                autoComplete="off"
                                
                                
                                
                                
                            />
                            
                        </Row>
                        {/* <div className="input-field">
                            <input className="input-name" name="newGame" autoComplete="off" data={this.gamesList} id="new-game"placeholder={`Current: ${this.props.channelOBJ.game}`} type="text" onChange={this.changeHandler} value={this.state.newGamePlaying}/>
                            <label for="new-name">Update Game</label>
                        </div> */}
                        <div className="input-field command-input-text">
                            <input className="input-name" name="newTitle" autoComplete="off" id="new-title"placeholder={`Current: ${this.props.channelOBJ.status}`} type="text" onChange={this.changeHandler} value={this.state.newTitle}/>
                            <label for="new-name">Update Title</label>
                        </div>
                        <div onClick={()=>{
                            console.log(this.state.newGame)
                    axios({
                        method: 'put', //you can set what request you want to be
                        url: 'https://api.twitch.tv/kraken/channels/'+this.props.channelOBJ.userID,
                        data: {"channel": {"status": this.state.newTitle, "game": this.state.newGame}},
                        headers: {
                            "Accept": "application/vnd.twitchtv.v5+json",
                            "Client-ID": clientID,
                            "Authorization": 'OAuth ' + this.props.channelOBJ.oauth,
                            'Content-Type': 'application/json'
                        }
                      })
                      console.log(this.state)
                      this.setState({
                          newGame:"",
                          newTitle:""
                      })
                      setTimeout(() => {
                        this.props.channelOBJ.statusFunc();
                      }, 500);
                      
                }} className="s1 btn right-align" waves='light'>Update</div>

                    </form>
                    



                <p>Lorem ipsum</p>
            </Modal>
            
        )
    }
}

export default ChannelStatus