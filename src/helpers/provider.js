import React,{Component} from 'react';
import axios from 'axios';
import tmi from 'tmi.js'
import {streamer, dumbData} from './dummydata'
import Obs from './obs-server'

export const MyContext = React.createContext();

export class MyProvider extends Component {

    
    
    // begin= window.location.href.indexOf("=")
    // token = window.location.href.slice(this.begin+1,this.begin+31)
    state={
        game:null,
        title:null,
        profileScreen: true,
        OBSServer: null,
        OBSConnected:false,
        client:null,
        loadListener: false,
        // myId: dumbData.twitchId,
        // myOauth: dumbData.accessToken,
        // username: dumbData.displayName,
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
    showHideProfileScreen=()=>{
        
        this.setState({
                profileScreen: !this.state.profileScreen
            })
        
        
    }
    updateStatus=(game,title)=>{
        this.setState({
            game:game,
            title:title
        })
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
    // getOBSServer=(server)=>{
    //     this.setState({
    //         OBSServer:server
    //     })
    // }
    getOauth=()=>{
        axios.post("/api/getuserinfo").then(data=>{
            let obj = data.data.data
            // console.log("MY CONTEXT OAUTH", data)
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
                    // password: "oauth:"+dumbData.accessToken
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
                // email:obj.email,
                // partner: obj.isPartner,

            })
            
        })
    }
    getBizUser(){
        axios.post(`/api/getuserinfo/`).then(res=>{
            console.log("my greek", res)
            let commands = res.data.data.custom
            if(commands.length===0){
                axios.post("/api/newcommand",{name:"!test", reply:"Succeeded yey"}).then(data=>{
                    console.log("loaded new command")

                })
            }else{
                this.setState({
                    commands: commands
                })
            }
            
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
            axios.post(`/api/getuserinfo/`).then(res=>{
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
    makeOBS=()=>{
        let server = new Obs();
        server.connect()
        setTimeout(() => {
            this.setState({
                OBSServer:server
            })
        }, 2000);
        
    }
    componentDidMount(){
        console.log("MY PROVIDER MOUNTED", this.state)
        this.makeOBS()
        
        this.getOauth()
        this.getBizUser()
        // this.getUser()
    }
    render(){
        return (
            <MyContext.Provider value={{
                state: this.state,
                getOBSServer: this.getOBSServer,
                getOauth: this.getOauth,
                newMessage: this.newMessage,
                updateStatus:this.updateStatus,
                showHideProfileScreen: this.showHideProfileScreen
            }}>
                {this.props.children}
            </MyContext.Provider>
        )
    }
}