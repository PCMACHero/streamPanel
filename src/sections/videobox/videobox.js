import React from 'react';

const videoBox = (props)=>{
    let link = `https://player.twitch.tv/?channel=${props.channel}&muted=true`
   return ( 
    <div className="video-box"> 
        <iframe
            src={link}
            height="720"
            width="1280"
            frameBorder="0"
            scrolling="no"
            allowfullscreen={false}>
        </iframe>
    </div>

   )
}

export default videoBox;