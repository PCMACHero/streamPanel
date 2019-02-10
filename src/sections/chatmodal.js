import React, {Component} from "react"
import { streamer } from "../helpers/dummydata";


class ChatModal extends Component{
    client = this.props.client
    modStatus=null

    dbOfMods=[]
    // checkIfMod=(user)=>{
    //     this.modStatus=null
    //     this.client.mods(streamer).then((data)=> {
    //         if(data.includes(user)){
                
    //                 this.modStatus=true
                
    //         }else {
                
    //                 this.modStatus=false
                
    //         }
    //     }).catch(function(err) {
    //         //
    //     });
    // }

    userMod=(user,status)=>{
        if(status){
            this.client.unmod("streampanelapp", this.props.username).then((data)=>{
                console.log("DID unmod?", data)
            }).catch(function(err) {
                console.log("DID unmod error?", err)
            });
        } else {
            this.client.mod("streampanelapp", this.props.username).then((data)=> {
                console.log("DID mod?", data)
            }).catch(function(err) {
                console.log("DID mod?", err)
            });
        }
    }
    userBanTime=(user, type)=>{
        if(type==="ban"){
            this.client.ban("streampanelapp", user, "You are rude").then(function(data) {
                console.log(user+" has been banished")
            }).catch(function(err) {
                //
            });
        }
        else{
            this.client.timeout("streampanelapp", user, 300, "Rudeness").then(function(data) {
                console.log(data)
                console.log(user+" has been put on time-out for "+data[2]/60+ " minutes")
            }).catch(function(err) {
                //
            });
        }
    }

    componentDidMount(){
        // this.modStatus=null
        // this.checkIfMod(this.props.username)
        
    }

    render(){
        let db = this.props.modDB
        console.log("ARE YOU STILL A MOD?", this.props.username, db[this.props.username])
        let mod = null
        let status = null
        if(db[this.props.username]=== true){
            status = true
            mod = "UNMOD"
        } else {
            status = false
            mod = "MOD"
        }
        return (
            <div className="chat-modal">
                <div className="modal-title">{this.props.username}</div>
                <div className="modal-content">
                    <div className="m-c-side">
                        <div className="btn c-m-btn" onClick={()=>{this.userMod(this.props.username, status)}}>{mod}</div>
                        <div className="btn c-m-btn">WHISPER</div>
                    </div>
                    <div className="m-c-side">
                        <div className="btn c-m-btn-bad" onClick={()=>{
                            this.userBanTime(this.props.username, "ban")
                        }}>BAN</div>
                        <div className="btn c-m-btn-bad" onClick={()=>{
                            this.userBanTime(this.props.username, "time-out", 300)
                        }}>TIME-OUT</div>
                    </div>
                    
                    
                    

                </div>
            </div>
        )
    }
}

export default ChatModal