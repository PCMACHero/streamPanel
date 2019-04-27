import React from 'react'
import axios from 'axios'
import { clientID } from '../common/common';

export default class Presets extends React.Component{
    state={
        divs:[],
        btnClicked:null,
        currentCollection:null,
        presetName: ""
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
    
    changeClass=(clicked)=>{
        console.log("clicked", clicked)
        
        // this.setState({
            
        //     btnClicked:btn
        // })
        this.makeDivs(this.props.context.state.presets,true)
    }

    // getIPs(callback){
    //     var ip_dups = {};
    //     //compatibility for firefox and chrome
    //     var RTCPeerConnection = window.RTCPeerConnection
    //         || window.mozRTCPeerConnection
    //         || window.webkitRTCPeerConnection;
    //     var useWebKit = !!window.webkitRTCPeerConnection;
    //     //bypass naive webrtc blocking using an iframe
    //     if(!RTCPeerConnection){
    //         //NOTE: you need to have an iframe in the page right above the script tag
    //         //
    //         //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
    //         //<script>...getIPs called in here...
    //         //
    //         var win = iframe.contentWindow;
    //         RTCPeerConnection = win.RTCPeerConnection
    //             || win.mozRTCPeerConnection
    //             || win.webkitRTCPeerConnection;
    //         useWebKit = !!win.webkitRTCPeerConnection;
    //     }
    //     //minimal requirements for data connection
    //     var mediaConstraints = {
    //         optional: [{RtpDataChannels: true}]
    //     };
    //     var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
    //     //construct a new RTCPeerConnection
    //     var pc = new RTCPeerConnection(servers, mediaConstraints);
    //     function handleCandidate(candidate){
    //         //match just the IP address
    //         var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
    //         var ip_addr = ip_regex.exec(candidate)[1];
    //         //remove duplicates
    //         if(ip_dups[ip_addr] === undefined)
    //             console.log("ip is",ip_addr);
    //         ip_dups[ip_addr] = true;
    //     }
    //     //listen for candidate events
    //     pc.onicecandidate = function(ice){
    //         //skip non-candidate events
    //         if(ice.candidate)
    //             handleCandidate(ice.candidate.candidate);
    //     };
    //     //create a bogus data channel
    //     pc.createDataChannel("");
    //     //create an offer sdp
    //     pc.createOffer(function(result){
    //         //trigger the stun server request
    //         pc.setLocalDescription(result, function(){}, function(){});
    //     }, function(){});
    //     //wait for a while to let everything done
    //     setTimeout(() => {
    //         //read candidate info from local description
    //         var lines = pc.localDescription.sdp.split('\n');
    //         lines.forEach(function(line){
    //             if(line.indexOf('a=candidate:') === 0){
    //                 handleCandidate(line);
    //             }
                    
    //     }, 2000);})
    //     // setTimeout(function(){
    //     //     //read candidate info from local description
    //     //     var lines = pc.localDescription.sdp.split('\n');
    //     //     lines.forEach(function(line){
    //     //         if(line.indexOf('a=candidate:') === 0)
    //     //             handleCandidate(line);
    //     //     });
    //     // }, 1000);
    // }


    changeGameAndTitle=(preset)=>{
        axios({
            method: 'put', //you can set what request you want to be
            url: 'https://api.twitch.tv/kraken/channels/'+this.props.context.state.twitchId,
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
            }, ()=>{console.log("coll changed to", this.state.currentCollection)})
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

    makeDivs=(presetArray,clicked)=>{
        let clickOff = null
        if(clicked){
            clickOff = {pointerEvents:"none"}
        }
        let current= null
        this.props.server.send({'request-type': 'GetCurrentSceneCollection'}).then(data=>{
            current = data["sc-name"]
            console.log("collection", data["sc-name"])
            
            console.log("made divs")
        let divArray=[]
        for(let i=0; i<presetArray.length;i++){

            let myClass = "preset-btn"
            // if(clicked){
            //     console.log("Run it")
            //     if(btn===i){
                    
            //         myClass= "preset-btn-current"
            //     }
            // }
            // else 
            if(presetArray[i].scnCollection===data["sc-name"]){
                myClass= "preset-btn-current"
            }
            
            let string = presetArray[i].presetName
            divArray.push(
            <div className="preset-item" key={i}>
                <div  className={myClass} style={clickOff}
                // style={{backgroundImage:this.color[i]}} 
                onClick={()=>{
                console.log(i)
                // this.changeClass(true)
                this.makeDivs(this.props.context.state.presets,true)
                this.loadPreset(presetArray[i])
                this.props.context.showHideScreen("profile")
                
               
                
            }}>{string.toUpperCase()}</div><div className="btn del" onClick={()=>{this.delPreset(i)}}>DEL</div>

            </div>
            )
        }
        this.setState({
            divs:divArray
        })



        })



        
    }

    addPreset=()=>{
        axios.post("/api/preset",{presetName:this.state.presetName,scnCollection:this.state.currentCollection, game:this.props.context.state.game, title: this.props.context.state.title}).then(data=>{
            this.props.context.updateState("presets", data.data.data)
            console.log(data.data.data)
        })
    }
    delPreset(i){
        
        axios.delete(`/api/preset/`,{"data":{index:i}}).then(res=>{
            this.props.context.updateState("presets", res.data.data)
            console.log("deleted ",res)
            
        }).catch((error) => {
            console.log('Not good man :(', error);
        })

        
    }

    handleChange=(e)=>{
        this.setState({
            presetName: e.target.value
        })
    }
    componentDidUpdate(prev){
        console.log("did update presets prev", prev)
        console.log("did update presets props",this.props)
        if(this.props.context.state.event["update-type"]==="SceneCollectionChanged"){
            this.getCollection()
            
            this.makeDivs(this.props.context.state.presets)
        }
        
        if(this.props.server && prev.server===null){
            this.makeDivs(this.props.context.state.presets)
            
            console.log("rendered presets")
        }
        if(prev.show !== this.props.show){
            this.makeDivs(this.props.context.state.presets)
            console.log("rendered presets 2")
        }
        if(prev.context.state.presets !== this.props.context.state.presets){
            console.log("TRIED TO LOAD PRESETS", this.props.context.state.presets)
            this.makeDivs(this.props.context.state.presets)
        }
        
    }
    componentDidMount(){
        // this.getIPs()
        this.getCollection()
        this.makeDivs(this.props.context.state.presets)
        document.getElementById("preset-name").setAttribute("autocomplete", "off")
        
    }
  

    render(){
        console.log("re rendered")
        return (
            <React.Fragment>
                <div className="preset-item">
                    <input type="text" style={{color:"white"}}name="preset-name" id="preset-name" value={this.state.presetName} onChange={(e)=>{this.handleChange(e)}}/>
                    <div className="btn" 
                    // style={{width:"300px", backgroundColor:"purple"}} 
                    onClick={()=>{this.addPreset()}}>SAVE</div>
                </div>
                
                <div className="presets-box">
                {this.state.divs}
                </div>
                
            </React.Fragment>
                
            
            
        )
    }
}