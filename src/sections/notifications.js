import React, {Component} from 'react'
import axios from 'axios'
import { clientID } from '../common/common';
import { setInterval } from 'timers';
import './notifications.css'
import { streamerID } from '../helpers/dummydata';

class Notifications extends Component{
    div = null
    counters = 0
    counters2 = 10000
    arrOfSubs=[]
    state={
        array:[<div key={0}>Fetching Recents...</div>],
        arrayOfSubs:[]
    }
getSubs=()=>{
    
    this.props.client.on("subscription", (channel, username, method, message, userstate)=> {

        console.log("NEW SUB")
        this.counters+=1
    //    this.arrOfSubs.push(<div key={this.counters} className="sub">{`${username} sub`}</div>)

    //    if(this.arrOfSubs.length>7){
    //     this.arrOfSubs.pop()
    //   }
    
    this.setState(prevState => ({
        arrayOfSubs: [...prevState.arrayOfSubs, <div key={this.counters} className="sub">{`${username} sub`}</div>]
      })
      
      )
      let elem = document.getElementsByClassName("follow")
      elem.scrollBottom = elem.scrollHeight
    })
    this.props.client.on("resub", (channel, username, months, message, userstate, methods)=> {
        console.log("RESUB METHOD: ",methods)
        this.counters2+=1
        this.arrOfSubs.push(<div key={this.counters2} className="resub">{`${username} Resub x${months}`}</div>)
        console.log("NEW ARR",this.arrOfSubs)
       
        this.setState(prevState => ({
            arrayOfSubs: [...prevState.arrayOfSubs, <div key={this.counters2} className="resub">{`${username} Resub x${months}`}</div>]
          }))
          let elem = document.getElementsByClassName("follow")
          elem.scrollBottom = elem.scrollHeight
  }
  
    )
}
    
            
     


getRecentFollows=()=>{
    // let URL = "https://api.twitch.tv/helix/users/follows?first=20&to_id="+this.props.userID
    let URL = "https://api.twitch.tv/helix/users/follows?first=6&to_id="+streamerID
    let headers = {
        headers: {
            "Client-ID": clientID,

        }
    }
    axios.get(URL,headers).then(data=>{
        let message=""
        console.log("MY AXIOS FOLLOWERS DATA: ", data.data.data.length)
        let tempArr = []
        for(let i = 0; i<data.data.data.length; i++){
            let now = new Date();
            let timeStamp = new Date(data.data.data[i].followed_at)
            let minutes = (now-timeStamp)/1000/60
            let time = ""
            let notiClass = ""
            time = Math.floor(minutes)
            if(time>=1){
                message=`${data.data.data[i].from_name} ${time}m ago`
            } else if(minutes<1){
                notiClass="animated infinite pulse"
                time = "now"
                message=`${data.data.data[i].from_name} now`
            }
        

            tempArr.push(<div key={i} className={"notification "+notiClass}>{message}</div>)
        } this.setState({
            array: tempArr
        })
        // 0: {from_id: "216919799", from_name: "sneakery_jr_", to_id: "23822990", to_name: "KatGunn", followed_at: "2018-12-18T11:53:12Z"}
    }) 

}

componentDidMount(){

    this.getSubs()
    // this.getResubs()

    // this.props.client.on("subscription", function (channel, username, method, message, userstate) {
    //     console.log("MY SUB LISTENER: ",username, method, channel, message, userstate)
    // });


    setInterval(() => {
        
        this.getRecentFollows()
    }, 10000);
}

render(){
    if(this.state.arrayOfSubs.length===0){
        this.div = <div className="follows">YOUR SUBS WILL APPEAR HERE</div>
    } else {
        this.div = <div className="follows">{this.state.arrayOfSubs}</div>
    }
    
    return (
        <div className="notifications-container">
            <div className="follows-container">
                <div className="follows-title">FOLLOWS</div>
                <div className="follows">{this.state.array}</div>
                
                <div className="follows-title">SUBS</div>
                {this.div}
                {/* <div className="follows">{this.state.arrayOfSubs}</div> */}
                
            </div>
            <div className="subs-container">
            
                <div className="tweet-container">
                    <div className="tweet-btn">
                        <div className="title">TWEET</div>
                        <div className="tweet-logo"></div>
                    </div>
                    
                </div>
                <div className="sp-logo"></div>
            </div>
            
            
        </div>
            
        

    )
}
}

export default Notifications
