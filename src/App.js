import React, { Component } from 'react';
// import 'materialize-css/dist/css/materialize.min.css'
import StreamPanel from './views/streampanel'
import {MyProvider, MyContext} from './helpers/provider'
import TwitchLogin from './views/twitchlogin'
import Success from './views/success'
import about from './views/about'
import setup from './views/setup'
import {BrowserRouter, Route, Redirect} from 'react-router-dom'
import './App.css';
import Axios from 'axios';


class App extends Component {
  state={
    auth:null
  }

getAuth=()=>{
  Axios.post("/api/isuserauthenticated").then(data=>{
    console.log("AUTH DATA", data.data.message)
    console.log("AUTH DATA", data)
    if(data.data.message==="Success: User is Authenticated"){
      this.setState({
        auth:true
      })
    }else{
      this.setState({
        auth:false
      })
    }
    

  })
}
componentDidMount(){
this.getAuth()
}

  render() {
    
    return (
      
      <BrowserRouter>
      <MyProvider>
      
        <MyContext.Consumer>{
          context=>
          <div>
          
          <Route path="/success" component={Success} exact/>
          <Route path="/" exact render={() => <TwitchLogin context={context} auth={this.state.auth}/>}/>
          {/* <Route path="/" exact component={TwitchLogin}/> */}
          {/* <Route path="/" exact render={() => this.state.auth?<Redirect to="/panel"></Redirect>:<TwitchLogin context={context}/>}/> */}
          <Route path="/panel" exact render={() => <StreamPanel context={context}  />}/>

          
          <Route path="/about" component={about}/>
          <Route path="/setup" component={setup}/>
          </div>
        }


        </MyContext.Consumer>
          
        
        </MyProvider>
        
          
        
      </BrowserRouter>
      
    );
  }
}

export default App;
