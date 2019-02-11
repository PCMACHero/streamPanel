import React, {Component} from "react"
import { streamer } from "../helpers/dummydata";


class ChatModal extends Component{
    
    modStatus=null
    
    dbOfMods=[]
    // checkIfMod=(user)=>{
    //     this.modStatus=null
    //     this.props.client.mods(streamer).then((data)=> {
    //         if(data.includes(user)){
                
    //                 this.modStatus=true
                
    //         }else {
                
    //                 this.modStatus=false
                
    //         }
    //     }).catch(function(err) {
    //         //
    //     });
    // }

    userMod=(client,user,status, newMessage)=>{
        
        if(status){
            client.unmod("streampanelapp", this.props.username).then((data)=>{
                console.log("DID unmod?", data)
                newMessage(data)
            }).catch(function(err) {
                console.log("DID unmod error?", err)
                newMessage(`Cannot unmod: "${err}"`)
            });
        } else {
            client.mod("streampanelapp", this.props.username).then((data)=> {
                console.log("DID mod?", data)
                newMessage(data)
            }).catch(function(err) {
                newMessage(`Cannot mod: "${err}"`)
                console.log("DID mod?", err)
            });
        }
    }
    userBan=(client,user,newMessage)=>{
        
            client.ban("streampanelapp", user, "You are rude").then(function(data) {
                console.log(user+" has been banished")
                newMessage(`"${user}" has been banished to the netherrealm.`)
            }).catch(function(err) {
                newMessage(`Cannot ban: "${err}"`)
            });
    }
    userTime=(client,user, num, newMessage)=>{
       
            client.timeout("streampanelapp", user, num).then(function(data) {
                console.log(data)
                console.log(user+" has been put on time-out for "+data[2]/60+ " minutes")
                newMessage(user+" has been put on time-out for "+data[2]/60+ " minutes")
            }).catch(function(err) {
                newMessage(`Cannot time-out: "${err}"`)
            });
        
    }
    // componentDidUpdate(prev){
    //     if(prev.props.client===null && this.props.client){
    //         this.setState({
    //             client:this.props.client
    //         })
    //     }
    // }
    componentDidMount(){
        // this.modStatus=null
        // this.checkIfMod(this.props.username)
        
    }

    render(){
        let db = this.props.modDB
        console.log("modal rendered ", this.props.client)
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
            <div className="btns-modal">
                <div className="chat-modal">
                <div className="modal-title">{this.props.username}</div>
                <div className="modal-content">
                    <div className="m-c-side">
                        <div className="btn c-m-btn" onClick={()=>{this.userMod(this.props.client,this.props.username, status, this.props.newMessage)}}>{mod}</div>
                        <div className="btn c-m-btn">WHISPER</div>
                    </div>
                    <div className="m-c-side">
                        <div className="btn c-m-btn-bad" onClick={()=>{
                            this.userBan(this.props.client, this.props.username, this.props.newMessage)
                        }}>BAN</div>
                        <div className="btn c-m-btn-bad" onClick={()=>{
                            this.userTime(this.props.client,this.props.username, 300, this.props.newMessage)
                        }}>TIME-OUT</div>
                    </div>
                    
                    
                    

                </div>
            </div>
            </div>
            
        )
    }
}

export default ChatModal