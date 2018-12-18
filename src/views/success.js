import React,{Component} from 'react'
import axios from 'axios'
import './success.css'
import { clientID } from '../common/common';

class Success extends Component{
    state={
        username:"",
        userID:"",
        passwordInput:"",
        userOBJ:{
            "twitchID":"testing"
        }
    }
    username = ""
    getUser(){
        const token = this.props.location.hash.slice(14,44)
        const URL = "https://api.twitch.tv/kraken/channel"
        const headers = {
            headers: {
                "Client-ID":clientID,
                "Authorization": "OAuth "+token
            }
        }
        axios.get(URL,headers).then(data=>{
            this.setState({
                username:data.data.name,
                userOBJ:data.data
            })
        })
    }
    changeHandler = (event)=>{
        
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }
    clickHandler = ()=>{
        console.log(this.state.userOBJ)
        axios({
            
                url: '/customer',
                method: 'post',
                "headers": {
                    "Content-Type": "application/json",
                    
                            },
                "data": {
                    "twitchID": this.state.userOBJ._id,
                    "username": this.state.userOBJ.name,
                    "email": this.state.userOBJ.email,
                    "password": this.state.passwordInput,
                    "commands": []
                        }
              })
    }


    componentDidMount(){
        this.getUser()
    }
    render(){
        return(
            <div className="container-pass">
            <div className="choose-password">
                <div className="greeting">Hello {this.state.username}, choose a password!</div>
                <div className="input-box">
                    <input type="password" name="passwordInput" placeholder="password" onChange={this.changeHandler} className="password" value={this.state.passwordInput}/>
                    <div className="btn blue" onClick={this.clickHandler}>Sign-Up</div>
                </div>
            </div>
            </div>
            
        )
    }
}

export default Success