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
    
    changeClass=(clicked)=>{
        console.log("clicked", clicked)
        
        // this.setState({
            
        //     btnClicked:btn
        // })
        this.makeDivs(this.presetArray,true)
    }

    getIPs(callback){
        var ip_dups = {};
        //compatibility for firefox and chrome
        var RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
        var useWebKit = !!window.webkitRTCPeerConnection;
        //bypass naive webrtc blocking using an iframe
        if(!RTCPeerConnection){
            //NOTE: you need to have an iframe in the page right above the script tag
            //
            //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
            //<script>...getIPs called in here...
            //
            var win = iframe.contentWindow;
            RTCPeerConnection = win.RTCPeerConnection
                || win.mozRTCPeerConnection
                || win.webkitRTCPeerConnection;
            useWebKit = !!win.webkitRTCPeerConnection;
        }
        //minimal requirements for data connection
        var mediaConstraints = {
            optional: [{RtpDataChannels: true}]
        };
        var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
        //construct a new RTCPeerConnection
        var pc = new RTCPeerConnection(servers, mediaConstraints);
        function handleCandidate(candidate){
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var ip_addr = ip_regex.exec(candidate)[1];
            //remove duplicates
            if(ip_dups[ip_addr] === undefined)
                console.log("ip is",ip_addr);
            ip_dups[ip_addr] = true;
        }
        //listen for candidate events
        pc.onicecandidate = function(ice){
            //skip non-candidate events
            if(ice.candidate)
                handleCandidate(ice.candidate.candidate);
        };
        //create a bogus data channel
        pc.createDataChannel("");
        //create an offer sdp
        pc.createOffer(function(result){
            //trigger the stun server request
            pc.setLocalDescription(result, function(){}, function(){});
        }, function(){});
        //wait for a while to let everything done
        setTimeout(() => {
            //read candidate info from local description
            var lines = pc.localDescription.sdp.split('\n');
            lines.forEach(function(line){
                if(line.indexOf('a=candidate:') === 0){
                    handleCandidate(line);
                }
                    
        }, 2000);})
        // setTimeout(function(){
        //     //read candidate info from local description
        //     var lines = pc.localDescription.sdp.split('\n');
        //     lines.forEach(function(line){
        //         if(line.indexOf('a=candidate:') === 0)
        //             handleCandidate(line);
        //     });
        // }, 1000);
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
            
            let string = presetArray[i].preset
            divArray.push(<div key={i} className={myClass} style={clickOff}
                // style={{backgroundImage:this.color[i]}} 
                onClick={()=>{
                console.log(i)
                // this.changeClass(true)
                this.makeDivs(this.presetArray,true)
                this.loadPreset(presetArray[i])
                this.props.context.showHideScreen("profile")
                
                // setTimeout(() => {
                    
                //     // this.changeGameAndTitle(presetArray[i])
                    
                //     this.props.context.showHideProfileScreen()
                // }, 5000);
                
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
            this.makeDivs(this.presetArray)
            // this.getCollection()
            console.log("rendered presets")
        }
        if(prev.show !== this.props.show){
            this.makeDivs(this.presetArray)
            console.log("rendered presets 2")
        }
        
    }
    componentDidMount(){
        this.getIPs()
        this.makeDivs(this.presetArray)
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