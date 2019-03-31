import React, { Component } from 'react';
// import 'materialize-css/dist/css/materialize.min.css'
import StreamPanel from './views/streampanel'
import {MyProvider, MyContext} from './helpers/provider'
import TwitchLogin from './views/twitchlogin'
import Success from './views/success'
import about from './views/about'
import setup from './views/setup'
import {BrowserRouter, Route} from 'react-router-dom'
import './App.css';
import Axios from 'axios';


class App extends Component {

getAuth=()=>{
  Axios.post("/api/isuserauthenticated").then(data=>{
    console.log("AUTH DATA", data)
    

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
          <Route path="/" exact component={TwitchLogin}/>
          <Route path="/panel" exact render={() => <StreamPanel context={context}/>}/>

          
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
