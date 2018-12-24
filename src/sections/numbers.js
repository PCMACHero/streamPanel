import React,{Component} from 'react'
import axios from 'axios'

class Numbers extends Component{
    state={
        time: {},
        viewers: "",
        views: "",
        follows: "",
        subs: "",
        streamTime: ''
    }
getTime=()=>{
    const time = new Date()
    console.log(time)
    this.setState({
        time: time
    })

}
componentDidMount(){
    setInterval(() => {
        this.getTime()
    }, 1000);
}
render(){
    return (
        <div className="numbers-box">
            <div className="number-item">{this.state.time.toString()}</div>
        </div>
    )
}
}

export default Numbers