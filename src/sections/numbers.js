import React,{Component} from 'react'
import axios from 'axios'

class Numbers extends Component{
    state={
        channelOBJ:this.props.channelOBJ,
        timeCode: "",
        event: {},
        time: {},
        viewers: "",
        views: "",
        follows: "",
        subs: "",
        streamTime: ''
    }




        


getTime=()=>{
    const time = new Date()
    time.getHours()
    time.getMinutes()
    let ampm = time.getHours() >= 12 ? 'pm' : 'am';
    let minutes = time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes();
    let seconds = time.getSeconds() < 10 ? '0'+time.getSeconds() : time.getSeconds();
    // console.log(time)
    this.setState({
        time: `${time.getHours() > 12 ? time.getHours()-12: time.getHours()}:${minutes}:${seconds}${ampm}`
    })

}
componentDidMount(){
    
    setInterval(() => {
        
        this.getTime()
    }, 1000);
}
render(){
    return (
        // <div className="numbers-box">
        //     <div className="number-item">{this.state.time.toString()}</div>
        //     <div className="number-item">{this.state.channelOBJ.views}</div>
        // </div>

        <div className="profiles-btn" style={{display:"flex", flexDirection:"row"}}>
            <div className="profiles-btn" style={{width:"50%"}}>yes</div>
            <div className="profiles-btn" style={{width:"50%"}}>+</div>
        </div>
    )
}
}

export default Numbers