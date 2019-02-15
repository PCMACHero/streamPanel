import React,{Component, Fragment} from 'react'
import axios from 'axios'
import { clientID } from '../common/common';

export default class Presets extends Component{
    state={
        divs:[],
        btnClicked:null,
        currentCollection:null,
    }
    color=[
        "linear-gradient(rgb(255, 165, 0),rgb(255, 0, 0))",
        "linear-gradient(rgb(0, 251, 255),rgb(98, 0, 255))",
        "linear-gradient(rgb(0, 255, 0),rgb(255, 204, 0))",
        "linear-gradient(rgb(149, 0, 255),rgb(255, 64, 76))",
        "linear-gradient(rgb(0, 60, 255),rgb(58, 225, 255))"
            ]
    preset1={
        preset: "preset0",
        scnCollection: "ART",
        game: "Apex Legends",
        title: "Lets play some Apex"
    }
    preset2={
        preset: "preset1",
        scnCollection: "Untitled",
        game: "Fortnite",
        title: "Lets play some fort. Gievaway at 10subs!"
    }
    preset3={
        preset: "COD",
        scnCollection: "COD",
        game: "PLAYERUNKNOWN'S BATTLEGROUNDS",
        title: "pubg wagers!"
    }
    preset4={
        preset: "mrs",
        scnCollection: "mrs",
        game: "FIFA 19",
        title: "Lets play"
    }
    presetArray=[
        this.preset1, 
        this.preset2, this.preset3, this.preset4]
    
    changeClass=(btn)=>{
        console.log("clicked", btn)
        
        // this.setState({
            
        //     btnClicked:btn
        // })
        this.makeDivs(this.presetArray,btn)
    }

    changeGameAndTitle=(preset)=>{
        axios({
            method: 'put', //you can set what request you want to be
            url: 'https://api.twitch.tv/kraken/channels/'+this.props.context.state.myId,
            data: {"channel": {"status": preset.title, "game": preset.game}},
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": clientID,
                
                "Authorization": 'OAuth ' + this.props.context.state.myOauth,
                // this.props.channelOBJ.oauth,
                'Content-Type': 'application/json'
            }
          }).then(data=>{
              this.props.context.updateStatus(data.data.game,data.data.status)
              console.log("DATA UPDATED", data)
          })
    }
    getCollection=()=>{
        this.props.server.send({'request-type': 'GetCurrentSceneCollection'}).then(data=>{
            console.log("collection", data["sc-name"])
            this.setState({
                currentCollection:data["sc-name"]
            })
        })
    }
    loadPreset=(preset)=>{
        //set OBS profile
        
        this.props.server.send({'request-type': 'SetCurrentSceneCollection', "sc-name": preset.scnCollection}).then(data=>{
            console.log(data)
            if(data.status){
                this.props.context.newMessage(`Success:Collection changed to ${preset.scnCollection}`)
            } else{
                this.props.context.newMessage(`There was an error`)
            }
        })


    }

    makeDivs=(presetArray,btn)=>{
        let clickOff = null
        if(btn>=0){
            clickOff = {pointerEvents:"none"}
        }

        this.props.server.send({'request-type': 'GetCurrentSceneCollection'}).then(data=>{
            console.log("collection", data["sc-name"])
            
            console.log("made divs")
        let divArray=[]
        for(let i=0; i<presetArray.length;i++){

            let myClass = "preset-btn"
            if(btn>=0){
                console.log("Run it")
                if(btn===i){
                    
                    myClass= "preset-btn-current"
                }
            }
            else 
            if(presetArray[i].scnCollection===data["sc-name"]){
                myClass= "preset-btn-current"
            }
            
            let string = presetArray[i].preset
            divArray.push(<div key={i} className={myClass} style={clickOff}
                // style={{backgroundImage:this.color[i]}} 
                onClick={()=>{
                console.log(i)
                this.changeClass(i)
                this.loadPreset(presetArray[i])
                
                setTimeout(() => {
                    
                    // this.changeGameAndTitle(presetArray[i])
                    this.changeClass("preset-btn")
                    this.props.context.showHideProfileScreen()
                }, 2000);
                
            }}>{string.toUpperCase()}</div>)
        }
        this.setState({
            divs:divArray
        })



        })



        
    }
    componentDidUpdate(prev){
        console.log("did update", prev.show)
        console.log("did update", this.props.show)
        if(this.props.server && prev.server===null){
            this.makeDivs(this.presetArray,this.state.class)
            this.getCollection()
            console.log("rendered presets")
        }
        if(prev.show !== this.props.show){
            this.makeDivs(this.presetArray,this.state.class)
            console.log("rendered presets 2")
        }
        
    }
    componentDidMount(){
        
    }
  

    render(){
        console.log("re rendered")
        return (
            <Fragment>
                {this.state.divs}
            </Fragment>
                
            
            
        )
    }
}