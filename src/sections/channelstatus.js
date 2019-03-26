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
        newGame:null,
        currentTitle:"",
        newTitle:null,
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
                // this.getGameCover(data.data.stream.game)
                console.log("$$$", data.data.stream)
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
        if(game){
            axios.get("https://api.twitch.tv/helix/games?name="+game,this.headers).then(data=>{
        console.log("game cover game---->", game)  
        console.log("game cover data---->", data.data.data)  
        
            let boxURL = data.data.data[0].box_art_url.split("")
                boxURL.splice(boxURL.length-20)
                let boxURL2 = boxURL.join("")+"450x600.jpg"

               this.props.context.updateCover(boxURL2) 
        
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

    getTitleAndGame=()=>{
        //Get Title, and game
        console.log("CONTEXT IN STATUS", this.props.context)
        const oauth = this.props.context.state.myOauth
        // const oauth = "xp5b0vv17q14ue9l0zw9x8hpreznkn"
        const headers = {"headers":{
            "Client-ID": clientID,
            "Authorization": 'OAuth '+oauth
        }}
         axios.get("https://api.twitch.tv/kraken/channel",headers).then(data=>{
            console.log("GET CHAN STATUS!!!!: ",data.data.game)
            this.getGameCover(data.data.game)
            this.props.context.updateStatus(data.data.game,data.data.status)
            this.setState({
                currentGame: data.data.game,
                currentTitle: data.data.status,
                // channel: {
                    
                    
                    
                //     userID: data.data["_id"],
                //     partner:data.data.partner,
                //     name: data.data.name,
                //     email: data.data.email,
                //     mature: data.data.mature,
                //     views: data.data.views,
                //     streamKey: data.data.stream_key

                // }
                
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
    componentDidUpdate(prev){
        if((prev.context.state.game !== this.props.context.state.game)||(prev.context.state.title !== this.props.context.state.title)){
            this.getTitleAndGame()
            console.log("bloop", prev.context.state.game, this.props.context.state.game)
        }
    }

    componentDidMount(){
        
        setInterval(() => {
            
            this.getStreamData()
        }, 15000);
        setTimeout(() => {
            this.getStreamData()
            this.getTitleAndGame()
        }, 2000);
        
        
        
        this.getGamesList()
        
        
        // console.log("weeeeeeeeeeeeee",this.ChannelData)
    }
    render(){
        return(
            <div className="channel-status-box" style={{backgroundImage: `url(${this.props.context.state.gameCover})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                            <div className="status-bg" ></div>
                            <div className="status-info">
                                <div className="follows-title">STREAM STATUS</div>
                                <div className="status-box">
                                <div className="game-label">{this.state.currentGame}</div>
                                <div className="game-label">"{this.state.currentTitle}"</div>
                                <div className="game-label"><i className="material-icons" style={{color:"black", fontSize: "1.5em"}}>
face
</i>VIEWING:  <div style={{color: "#EE2B2A"}}>{this.state.channel.viewers}</div>
</div>
                                <div className="game-label">VIEWS: {this.state.channel.totalViews}</div>
                                <div className="game-label"><i className="material-icons" style={{color:"#EE2B2A", fontSize: "1.5em"}} >
favorite
</i>FOLLOWS: {this.state.channel.followers}</div>
                            
                            
                            </div>
                            </div>
                            
                            
                            
                            
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
                                
                            </div>
                        
                        
                    
            
        )
    }
}

export default ChannelStatus