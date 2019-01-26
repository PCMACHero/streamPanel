import React, { Component } from 'react';
import MainSection from '../sections/mainsection'
import {streamer} from "../helpers/dummydata"
import {clientID} from "../common/common"
import axios from "axios"

export const MyContext = React.createContext()

export class MyProvider extends Component {
    token = "mzilallgzh02pwqsyxhdm734kux3mk"
    state={
        myId: null,
        myOauth: this.token,
        

    }
    getOauth=(oauth)=>{
        this.setState({
            myOauth: oauth
        })
    }
    getUser(){
        axios.get("https://api.twitch.tv/kraken/channel", {headers: {
            Authorization: `OAuth ${this.token}`
        }}).then(data =>{
            let id= data.data._id
            let begginingCommand = {"!uptime": "1 day"}
                    let email = data.data.email
                    let commands = data.data.commands
                    let username = data.data.display_name
                    let partner = data.data.partner
            axios.get(`/spuser/${id}`).then(res=>{
                console.log("my greek", res)
                    
                if(res.data===null){
                    console.log("MY GREEK DATA WAS NULL")
                    commands = [{name: "!You are", response: "New"}]
                    axios.post(`/newspuser/`,{
                        _id: id,
                        username: username,
                        commands: commands,
                        email: email,
                        partner: partner,
                    })
                } else {
                    axios.put(`/spuser/${id}`,{
                        _id: id,
                        username: username,
                        commands: commands,
                        email: email,
                        partner: partner,
                    })
                }
                
                console.log("MY GREEK ", data)
            })
            console.log("MY SWEET USER DATA",data.data)
            this.setState({
                myId: id,
                username: username,
                commands: commands,
                email:email,
                partner: partner,

            })
        })
    }

    componentDidMount(){
        this.getUser()
    }
    render(){
        return (
            <MyContext.Provider value={{
                state: this.state,
                getOauth: this.getOauth
            }}>
                {this.props.children}
            </MyContext.Provider>
        )
    }
}

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
        <MyProvider>
            
            <div className="stream-panel App">
        <div className={this.state.startClass}>
            <div className="start-banner">STREAM PANEL</div>
            <div className="progress">
                <div className="indeterminate green"></div>
            </div>
        </div>


        <MainSection chanBadges={this.state.badges} oauth={this.token}/>
      </div>

        </MyProvider>
      
    );
  }
}

export default StreamPanel;