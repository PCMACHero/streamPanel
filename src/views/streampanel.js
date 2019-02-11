import React, { Component } from 'react';
import MainSection from '../sections/mainsection'
import {streamer} from "../helpers/dummydata"
import {clientID} from "../common/common"
import axios from "axios"
import { MyContext } from '../helpers/provider';



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


    token = this.props.location.hash.slice(14,44);
    // token = "rql8ru6ow4i3agf3i1xc0j8zzgpt39"
    getUser(){
        axios.get("https://api.twitch.tv/kraken/channel", {headers: {
            Authorization: `OAuth ${this.token}`
        }}).then(data =>{
            let id= data.data._id
            let begginingCommand = [{uptime: "1 day"}]
                    let email = data.data.email
                    let commands = JSON.stringify(begginingCommand)
                    let username = data.data.display_name
                    let partner = data.data.partner
            axios.get(`/spuser/${id}`).then(res=>{
                console.log("my greek", res)
                    
                if(res.data===null){
                    console.log("MY GREEK DATA WAS NULL")
                    
                    axios.post(`/newspuser/`,{
                        _id: id,
                        username: username,
                        commands: begginingCommand,
                        email: email,
                        partner: partner,
                    })
                } else {
                    axios.put(`/spuser/${id}`,{
                        _id: id,
                        username: username,
                        commands: begginingCommand,
                        email: email,
                        partner: partner,
                    })
                }
                
                console.log("MY GREEK ", data)
            })
            console.log("MY SWEET USER DATA",data.data)
            
        })
    }

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
        console.log("STREAMPANEL Mounted")
        
        // this.getUser()
        setTimeout(() => {
            this.setState({
                startClass:"start-fade"
            })
        }, 2000);
        this.getUserID()
        
        
        

        // console.log("LOCATION DATA:----------->",this.props.location.hash.slice(14,44))
    }
    
  render() {
      console.log("STREAMPANEL RENDERED")
    return (
        
            
            <div className="stream-panel panel-container">
        <div className={this.state.startClass}>
            <div className="start-banner">STREAM PANEL</div>
            <div className="progress">
                <div className="indeterminate green"></div>
            </div>
        </div>

        <MyContext.Consumer>{
            context=>
            <MainSection chanBadges={this.state.badges} context={context}/>
        }

        </MyContext.Consumer>
        
      </div>

       
      
    );
  }
}

export default StreamPanel;