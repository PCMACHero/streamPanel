import React, { Component } from 'react';
import MainSection from '../sections/mainsection'
import {streamer} from "../helpers/dummydata"
import {clientID} from "../common/common"
import axios from "axios"

class StreamPanel extends Component {
    
    state={
        userID: null,
        startClass:"start"
    };
    
    headers={
        'headers': { 
            'Accept': "application/vnd.twitchtv.v5+json",
            "Client-ID": clientID
                                 } 
            }


    // token = this.props.location.hash.slice(14,44);
    token = "qoyqtgjhh6uwy7x1rfzv6fpdoclqjf"

    getUserID(){
        const URL = "https://api.twitch.tv/kraken/users?login="+streamer
        
        axios.get(URL, this.headers).then(response => {
                           const myOBJ = response
                            
                            // console.log(myOBJ.data.users[0]._id);

                            axios.get("https://api.twitch.tv/kraken/chat/"+myOBJ.data.users[0]._id+"/badges", this.headers).then(response2 =>{
                                const myOBJ2 = response2.data
                                console.log("MY OBJ2 DATA====>:",myOBJ2)
                                this.setState({
                                    badges: myOBJ2
                                })
                            })
                            
                        })
                        
                        
                            }



        
        
    

    componentDidMount(){
        setTimeout(() => {
            this.setState({
                startClass:"start-fade"
            })
        }, 2000);
        this.getUserID()
        
        
        

        // console.log("LOCATION DATA:----------->",this.props.location.hash.slice(14,44))
    }
    
  render() {
    return (
      <div className="stream-panel App">
        <div class={this.state.startClass}>
            <div class="start-banner">STREAM PANEL</div>
            <div class="progress">
                <div class="indeterminate green"></div>
            </div>
        </div>


        <MainSection chanBadges={this.state.badges} oauth={this.token}/>
      </div>
    );
  }
}

export default StreamPanel;