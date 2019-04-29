import React from 'react';

class VideoBox extends React.Component{
    
        
       
        
    state = {
            condition: true
            }
            
    
    handleClick = () => {
        console.log('this is:', this);
        this.setState({
            condition: !this.state.condition
          })
      }
 
    
    render(){
        return ( 
            <div  className={this.props.class }
            >   
            
                <iframe 
                    title="video"
                    src={`https://player.twitch.tv/?channel=${this.props.channel}&muted=true`}
                    height="720"
                    width="1280"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={false}>
                </iframe>
            </div>
        
           )
    }
    
}

export default VideoBox;