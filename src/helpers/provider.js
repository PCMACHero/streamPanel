import React,{Component} from 'react';
import axios from 'axios';
import tmi from 'tmi.js'
import {streamer} from './dummydata'

export const MyContext = React.createContext();

export class MyProvider extends Component {
    // begin= window.location.href.indexOf("=")
    // token = window.location.href.slice(this.begin+1,this.begin+31)
    state={
        client:null,
        loadListener: false,
        myId: null,
        myOauth: null,
        username: null,
        commands: null,
        email:null,
        partner: null,
        messageCenter: {
            m:"Status: All well",
            class: ""
        }
        

    }
    newMessage = (message)=>{
        console.log("NEW MESSAGE",message)
        this.setState({
            messageCenter: {
                m:message,
                class: "animated flash slow infinite"
            },
        })
        setTimeout(() => {
            this.setState({
                messageCenter: {
                    m:"Status: All well",
                    class: ""}
            })
        }, 7000);
    }
    getOauth=()=>{
        axios.post("/api/getuserinfo").then(data=>{
            let obj = data.data.data
            console.log("MY CONTEXT OAUTH", data)
           let options = {
                options: {
                    debug: true
                },
                connection: {
                    reconnect: true
                },
                identity: {
                    username: "streampanelapp",
                    password: "oauth:"+obj.accessToken
                },
                channels: [streamer]
            };
       let client = new tmi.client(options);
       client.connect()
            console.log("now what", data)
            this.setState({
                client: client,
                myOauth: obj.accessToken,
                loadListener: true,
                myId: obj.twitchId,
                username: obj.displayName,
                // commands: commands,
                email:obj.email,
                partner: obj.isPartner,

            })
            
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
                loadListener: true,
                myId: data.data._id,
                username: username,
                commands: commands,
                email:email,
                partner: partner,

            })
        })
    }

    componentDidMount(){
        console.log("MY PROVIDER MOUNTED", this.state)
        this.getOauth()
        // this.getUser()
    }
    render(){
        return (
            <MyContext.Provider value={{
                state: this.state,
                getOauth: this.getOauth,
                newMessage: this.newMessage,
            }}>
                {this.props.children}
            </MyContext.Provider>
        )
    }
}