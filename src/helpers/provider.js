import React,{Component} from 'react';
import axios from 'axios';
import tmi from 'tmi.js'
import {streamer, dumbData} from './dummydata'
import bigGameList from './gamelist'
import Obs from './obs-server'

export const MyContext = React.createContext();

export class MyProvider extends Component {

    
    
    // begin= window.location.href.indexOf("=")
    // token = window.location.href.slice(this.begin+1,this.begin+31)
    state={
        event:null,
        game:null,
        title:null,
        gameCover:null,
        blur:false,
        commandsScreen: false,
        chatModeScreen: false,
        mixerScreen: false,
        profileScreen: false,
        updateScreen: false,
        OBSServer: null,
        OBSConnected:false,
        OBSCounter:1,
        client:null,
        loadListener: false,
        // myId: dumbData.twitchId,
        // myOauth: dumbData.accessToken,
        // username: dumbData.displayName,
        myId: null,
        myOauth: null,
        username: null,
        displayName: null,
        commands: null,
        presets: null,
        email:null,
        partner: null,
        messageCenter: {
            m:"Status: All well",
            class: ""
        },
        gamesList:{},
        "followers-only": null,
        "subs-only": null,
        slow: null,
        "emote-only": null,
        

    }
    showHideScreen=(screen, onoff)=>{
        if(screen==="all"){
            this.setState({
                commandsScreen: onoff,
                chatModeScreen: onoff,
                profileScreen: onoff,
                mixerScreen: onoff,
                updateScreen: onoff,
                blur:onoff
            })
        }
        if(screen==="profile"){
        this.setState({
                profileScreen: onoff,
                blur: onoff
            })
        }
        if(screen==="mixer"){
            this.setState({
                mixerScreen: onoff,
                blur: onoff,
            })
        }
        if(screen==="update"){
            this.setState({
                updateScreen: onoff,
                blur: onoff,
            })
        }
        if(screen==="chatMode"){
            this.setState({
                chatModeScreen: onoff,
                blur: onoff,
            })
        }
        if(screen==="commands"){
            this.setState({
                commandsScreen: onoff,
                blur: onoff,
            })
        }
        
        
        
    }
    updateState=(key, value)=>{
        this.setState({
            [key]:value
        })
    }
    updateCover=(cover)=>{
        this.setState({
            gameCover:cover
        })
    }
    updateStatus=(game,title)=>{
        this.setState({
            game:game,
            title:title,
            
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

    makeTwitchClient=(oauth, channel, res)=>{
        console.log("res is", res)
        let options = {
            options: {
                debug: true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: channel,
                password: "oauth:"+oauth
                
            },
            channels: [channel]
        };
   let client = new tmi.client(options);
   client.connect().then(data=>{
    this.setState({
        commands: res.data.data.custom,
        presets: res.data.data.presets,
        custom: res.data.data.custom,
        twitchId: res.data.data.twitchId,
        myOauth: res.data.data.accessToken,
        displayName: res.data.data.displayName,
        isPartner: res.data.data.isPartner,
        email: res.data.data.email,
        client: client,
        loadListener: true


    })
   })
        
        
    }

    getBizUser=()=>{
        axios.post(`/api/getuserinfo/`).then(res=>{
            console.log("my greek 2", res.data.data)
            
            this.makeTwitchClient(res.data.data.accessToken, res.data.data.displayName, res)
            
            
        })
    }
    
    makeOBS=()=>{
        let server = new Obs();
        server.connect().then(data=>{
            this.setState({
                OBSServer:server
            })
        })
        
            
       
        
    }

    getGamesList=()=>{
        let tempList={}
        for(let i=0; i<bigGameList.length; i++){
            
               let boxURL = bigGameList[i].box_art_url.split("")
               boxURL.splice(boxURL.length-20)
               let boxURL2 = boxURL.join("")+"150x200.jpg"
               
               tempList[bigGameList[i].name]=boxURL2
               //add to DB
        }

           this.setState({
               gamesList:tempList
           })
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
        console.log("MY PROVIDER MOUNTED", this.state)
        this.getGamesList()
        this.makeOBS()
        
        // this.getOauth()
        this.getBizUser()
        
    }
    render(){
        return (
            <MyContext.Provider value={{
                state: this.state,
                updateState: this.updateState,
                getOBSServer: this.getOBSServer,
                getOauth: this.getOauth,
                newMessage: this.newMessage,
                updateStatus:this.updateStatus,
                updateCover: this.updateCover,
                showHideScreen: this.showHideScreen
            }}>
                {this.props.children}
            </MyContext.Provider>
        )
    }
}