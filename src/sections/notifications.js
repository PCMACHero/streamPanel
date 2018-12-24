import React, {Component} from 'react'
import axios from 'axios'
import { clientID } from '../common/common';
import { setInterval } from 'timers';
import './notifications.css'
import { streamerID } from '../helpers/dummydata';

class Notifications extends Component{
    arrOfSubs=[]
    state={
        array:[<div key={0}>Fetching Recents...</div>],
        arrayOfSubs:[]
    }
getSubs(){
    
    this.props.client.on("subscription", (channel, username, method, message, userstate)=> {
       this.arrOfSubs.unshift(<div className="sub">{`${username} sub`}</div>)
       if(this.arrOfSubs.length>7){
        this.arrOfSubs.pop()
      }
        this.setState({
        arrayOfSubs: this.arrOfSubs
      })
      
    });
    
    this.props.client.on("resub", (channel, username, months, message, userstate, methods)=> {
        console.log("RESUB METHOD: ",methods)
        this.arrOfSubs.unshift(<div className="resub">{`${username} Resub x${months}`}</div>)
        if(this.arrOfSubs.length>7){
            this.arrOfSubs.pop()
          }
            this.setState({
            arrayOfSubs: this.arrOfSubs
          })
     });
}

getRecentFollows=()=>{
    // let URL = "https://api.twitch.tv/helix/users/follows?first=20&to_id="+this.props.userID
    let URL = "https://api.twitch.tv/helix/users/follows?first=5&to_id="+streamerID
    let headers = {
        headers: {
            "Client-ID": clientID,

        }
    }
    axios.get(URL,headers).then(data=>{
        
        console.log("MY AXIOS FOLLOWERS DATA: ", data.data.data.length)
        let tempArr = []
        for(let i = 0; i<data.data.data.length; i++){
            let now = new Date();
            let timeStamp = new Date(data.data.data[i].followed_at)
            let minutes = (now-timeStamp)/1000/60
            let time = ""
            let notiClass = ""
            if(minutes>=1){

                time = Math.floor(minutes)
            } else {
                notiClass="animated infinite pulse"
                time = "now"
            }
        

            tempArr.push(<div key={i} className={"notification "+notiClass}>{data.data.data[i].from_name} {time}m</div>)
        } this.setState({
            array: tempArr
        })
        // 0: {from_id: "216919799", from_name: "sneakery_jr_", to_id: "23822990", to_name: "KatGunn", followed_at: "2018-12-18T11:53:12Z"}
    }) 

}

componentDidMount(){

    this.getSubs()

    // this.props.client.on("subscription", function (channel, username, method, message, userstate) {
    //     console.log("MY SUB LISTENER: ",username, method, channel, message, userstate)
    // });


    setInterval(() => {
        this.getRecentFollows()
    }, 5000);
}

render(){
    
    return (
        <div className="notifications-container">
            <div className="follows-container">
                <div className="follows-title">Recent Follows</div>
                {this.state.array}
            </div>
            <div className="subs-container">
            <div className="follows-title">Recent Subs</div>
                {this.state.arrayOfSubs}
            </div>
            
            
        </div>
            
        

    )
}
}

export default Notifications
