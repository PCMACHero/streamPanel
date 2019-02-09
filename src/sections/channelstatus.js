import React, {Component} from 'react';
import axios from "axios"
import {clientID} from '../common/common'
import {streamer, streamerID} from '../helpers/dummydata'
import {Modal, Row, Autocomplete} from 'react-materialize'
import { setInterval, setTimeout } from 'timers';
import bigGameList from '../helpers/gamelist'
import { MyContext } from '../helpers/provider';

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
        gameCover:"",
        viewers: "",
        followers: "",
        channel: {
            views: "",

        }
    }
    ChannelData = this.props.channelOBJ
    getStreamData = ()=>{
        axios.get(`https://api.twitch.tv/kraken/streams/${streamerID}`, {
            headers: {
                Accept:"application/vnd.twitchtv.v5+json",
                "Client-ID": clientID
            }
        }).then(data=>{
            if(data.data.stream){
                console.log("$$$", data.data.stream._id)
            this.setState({
                channel: {
                    _id: data.data.stream._id,
                    viewers: data.data.stream.viewers,
                    totalViews: data.data.stream.channel.views,
                    followers: data.data.stream.channel.followers
                }
            })
            }
            
        })
    }
    changeHandler = (event)=>{
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    getGameCover=(game)=>{
        axios.get("https://api.twitch.tv/helix/games?name="+game,this.headers).then(data=>{
        console.log("game cover---->", data)  
        
        let boxURL = data.data.data[0].box_art_url.split("")
                boxURL.splice(boxURL.length-20)
                let boxURL2 = boxURL.join("")+"450x600.jpg"

                
        
        this.setState({
                gameCover:boxURL2
            })
        })
    }

    getChannelStatus=()=>{
        const oauth = this.props.oauth
        // const oauth = "xp5b0vv17q14ue9l0zw9x8hpreznkn"
        const headers = {"headers":{
            "Client-ID": clientID,
            "Authorization": 'OAuth '+oauth
        }}
         axios.get("https://api.twitch.tv/kraken/channel",headers).then(data=>{
            console.log("GET CHAN STATUS!!!!: ",data.data)
            this.getGameCover(data.data.game)
            
            this.setState({
                currentGame: data.data.game,
                currentTitle: data.data.status,
                channel: {
                    
                    
                    
                    userID: data.data["_id"],
                    partner:data.data.partner,
                    name: data.data.name,
                    email: data.data.email,
                    mature: data.data.mature,
                    views: data.data.views,
                    streamKey: data.data.stream_key

                }
                
            })
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
        this.getStreamData()
        setInterval(() => {
            this.getStreamData()
        }, 15000);
        
        this.getChannelStatus()
        
        
        this.getGamesList()
        
        
        // console.log("weeeeeeeeeeeeee",this.ChannelData)
    }
    render(){
        return(
            <Modal className="update-modal"
                header='UPDATE CHANNEL'
                trigger={<div className="channel-status-box" >
                            <div className="status-bg" style={{backgroundImage: `url(${this.state.gameCover})`, backgroundSize: "cover", backgroundPosition: "center"}}></div>
                            <div className="status-info">
                                <div className="follows-title">STREAM STATUS</div>
                                <div className="status-box">
                                <div className="game-label">{this.state.currentGame}</div>
                                <div className="game-label">"{this.state.currentTitle}"</div>
                                <div className="game-label"><i className="material-icons" style={{color:"black", fontSize: "1.5em"}}>
face
</i>Viewers:  <div style={{color: "#EE2B2A"}}>{this.state.channel.viewers}</div>
</div>
                                <div className="game-label">Total Views: {this.state.channel.totalViews}</div>
                                <div className="game-label"><i className="material-icons" style={{color:"#EE2B2A", fontSize: "1.5em"}} >
favorite
</i>Total Follows: {this.state.channel.followers}</div>
                            
                            
                            </div>
                            </div>
                            
                            {/* <div className="game-playing" > */}
                            {/* <img className="game-cover" src={this.state.gameCover}/> */}
                            
                            
                            
                            {/* </div> */}
                            {/* <div className="follows-title">STREAM TITLE</div> */}
                            {/* <div className="channel-title"> */}
                            
                                
                            {/* </div> */}
                            
                            
                                <MyContext.Consumer>
                                    {context=>
                                    <div className="message-center" onClick={(e)=>{
                                        e.stopPropagation();
                                        context.newMessage("Batman")
                                        console.log(context.state.messageCenter)
                                    }}>
                                        <div className={context.state.messageCenter.class} >{context.state.messageCenter.m}</div>
                                        
                            </div>
                                        
                                    }
                                </MyContext.Consumer>
                                
                            
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
                            console.log("MY OAUTH IN PUT", this.props.oauth)
                    axios({
                        method: 'put', //you can set what request you want to be
                        url: 'https://api.twitch.tv/kraken/channels/'+this.state.channel.userID,
                        data: {"channel": {"status": this.state.newTitle, "game": this.state.newGame}},
                        headers: {
                            "Accept": "application/vnd.twitchtv.v5+json",
                            "Client-ID": clientID,
                            // "Authorization": 'OAuth ' + "xp5b0vv17q14ue9l0zw9x8hpreznkn",
                            "Authorization": 'OAuth ' + this.props.oauth,
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
            </Modal>
            
        )
    }
}

export default ChannelStatus