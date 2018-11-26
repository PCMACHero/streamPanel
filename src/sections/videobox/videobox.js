import React from 'react';

class VideoBox extends React.Component{
    constructor(props){
        
        super(props);
        this.link = `https://player.twitch.tv/?channel=${props.channel}&muted=true`
        this.state = {
            condition: true
            }
            
    }
    handleClick = () => {
        console.log('this is:', this);
        this.setState({
            condition: !this.state.condition
          })
      }
 
    
    render(){
        return ( 
            <div  className={ this.state.condition ? "video-box-small" : "video-box-big" }
            >   <div className="click" onClick={this.handleClick}>CLICK</div>
                <iframe 
                    title="video"
                    src={this.link}
                    height="720"
                    width="1280"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={true}>
                </iframe>
            </div>
        
           )
    }
    
}

export default VideoBox;