// import React, { Component } from 'react';
// import axios from 'axios';
// let client_id="qcnyt9qlx36ej3dmou2x16xd36t73x";
// let redirect_uri= "localhost:3000/success"
// class TwitchList extends Component{
//     state = {
//         persons: [],
//     }

//     componentDidMount(){
//         axios.get(`https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=
//         ${redirect_uri}&response_type=code&scope=user:edit:broadcast`,{ crossdomain: true })
//         .then(res => {
//             console.log("HOLA")
//             console.log(res);
//             this.setState({
//                 persons: res.data
//             })
//         })
//     }
//     render(){
//         return (
//             <div>
//                 hello there
//             </div>
//         )
//     }
//     }

//     export default TwitchList;

