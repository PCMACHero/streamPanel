import React, {Component} from 'react'

export default class BlurScreen extends Component{
    state={
        class: null
    }
    changeClass=()=>{
        this.setState({
            class: "preset-btn-clicked"
        })
    }
    render(){
        console.log("blurry", this.props.show)
        if(this.props.show){
            return (
                <div className="blur-container" style={{filter:"blur(5px)"}} onClick={()=>{
                    // this.changeClass()
                    
                        this.props.close("all",false)
                    
                    
                }} style={{height:"100vh", width:"100vw", zIndex:"5", position:"absolute", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <div className="blur-box" onClick={(e)=>{
                        e.stopPropagation();
                    }}style={{height:"70%",width:"70%",display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", border:"1px solid white", backgroundColor:this.props.color}}>
                        <div className="close-container" style={{width:"100%"}}>
                            <div onClick={()=>{
                                this.props.close("all",false)
                            }}style={style.close}><i style={{color:"red"}} className="material-icons">clear</i></div>
                            
                        </div>
                        
                        <div className="blur-title" style={{fontSize:"2.5em", color:"white"}}>{this.props.title}</div>
                        <div className="blur-content">{this.props.content}</div>
                    </div>
                </div>
            )
        }else{
            return (
                null
               
            )
        }
        
    }
}

let style ={
    close:{
        fontSize: "2rem",
        height: "60px",
        width: "60px",
        color: "red",
        
    }
}