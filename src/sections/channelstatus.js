import React, {Component} from 'react';
import axios from "axios"
import {clientID} from '../common/common'
import {streamer} from '../helpers/dummydata'
import {Modal, Row, Autocomplete} from 'react-materialize'
import { setInterval } from 'timers';
import bigGameList from '../helpers/gamelist'

class ChannelStatus extends Component{
    gamesList={}
    headers={headers:{
        "Client-ID": clientID,
    }}
    state={
        currentGame: "",
        newGame:"",
        currentTitle:"",
        newTitle:"",
    }
    ChannelData = this.props.data
    
    changeHandler = (event)=>{
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
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


    componentDidMount(){
        this.getGamesList()
        
        
        // console.log("weeeeeeeeeeeeee",this.ChannelData)
    }
    render(){
        return(
            <Modal className="commands-modal"
                header='UPDATE CHANNEL'
                trigger={<div className="channel-status-box">
                            <div className="game-playing">{this.props.channelOBJ.game}</div>
                            <div className="channel-title">
                                <div className="text-div">"{this.props.channelOBJ.status}"</div>
                            </div>
                            
                            <div className="update-card">
                                <div className="text-div">UPDATE CHANNEL</div>
                                <i class="material-icons">
                                    update
                                    </i>
                            </div>
                            
                        </div>}>
                        
                    <form className="commands-input">
                        <Row>
                            <Autocomplete
                                limit={10}
                                minLength={2}
                                m={12}
                                onChange={this.changeHandler}
                                onAutocomplete={(e)=>{this.setState({
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
                            <input className="input-name" name="newTitle" autoComplete="off" id="new-title"placeholder={`Enter Title ex: ${this.props.channelOBJ.status}`} type="text" onChange={this.changeHandler} value={this.state.newTitle}/>
                            {/* <label for="new-title">Update Title</label> */}
                        </div>
                        

                    </form>

                    



                
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
                      
                }} className="s1 btn right-align #4a148c purple darken-4" waves='light'>Update</div>
            </Modal>
            
        )
    }
}

export default ChannelStatus