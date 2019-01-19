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
    token = "rql8ru6ow4i3agf3i1xc0j8zzgpt39"

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
        <div className={this.state.startClass}>
            <div className="start-banner">STREAM PANEL</div>
            <div className="progress">
                <div className="indeterminate green"></div>
            </div>
        </div>


        <MainSection chanBadges={this.state.badges} oauth={this.token}/>
      </div>
    );
  }
}

export default StreamPanel;