import React from 'react'



export default class InfoPane extends React.Component{
    dummyOBJ = {

    }

    boxStyle = {
        
        display: "flex",
        flexDirection: "column",
        backgroundColor: this.props.color,
        alignItems: "center",
        // border: "solid 1px green"
    }

    titleStyle = {
        width: "90%",
        
        color: "white",
        
    }
    iconStyle = {
        margin: "5%",
        width: "90%",
        fontSize: "1.5em",
        color: "white",
        
    }
    bodyStyle = {
        width: "90%",
        
        color: "white",
        
    }
    render(){
        return(
            <div className="info-box" style={this.boxStyle}>
            
                <div className="info-title" style={this.titleStyle}>{this.props.title}</div>
                <div className="info-body" style={this.bodyStyle}>{this.props.body}</div>
                <div className="info-title" style={this.iconStyle}>{this.props.icon}{this.props.icon2}</div>
            </div>
            


        )
    }
}