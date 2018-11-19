import React from 'react';

const videoBox = (props)=>{
    let link = `https://player.twitch.tv/?channel=${props.channel}&muted=true`
   return ( 
    <div className="video-box"> 
        <iframe
        title="video"
            src={link}
            height="720"
            width="1280"
            frameBorder="0"
            scrolling="no"
            allowFullScreen={false}>
        </iframe>
    </div>

   )
}

export default videoBox;