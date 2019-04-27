import React from 'react'
import Collapsible from 'react-collapsible';
import {Link} from 'react-router-dom';
import "./about.css"

const about = ()=>{
    return (
        <div className="App">
        <nav>
    <div className="nav-wrapper">
    
      <a href="#" className="brand-logo right"><div className="sp">StreamPanel</div><div className="brand-img"></div></a>
      <ul id="nav-mobile" className="left ">
      <li><Link to="/">HOME</Link></li>
      <li><Link to="/setup">SETUP</Link></li>
      <li><Link to="/about">ABOUT</Link></li>
      </ul>
    </div>
  </nav>
        <div className="login-container2">
        
        
            <div className="about-us">
            <div><h2>FAQ</h2></div>

            <Collapsible  transitionTime={200} trigger={<div className="collapse">Who Are We?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
               <p>This project was created by me, and my cousin who is also a developer, joined to create the backend. I had the idea for this product before I learned how to develop, and was designing it, and describing how it should function in a “product manager” role. I then decided to pursue development since it seemed very fun, and so I did some self teaching, and finally attended and finished a coding bootcamp, where I began working on this project, which I have been working on since (while also working on other projects for clients).</p> 
              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">What Devices are Supported?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
               <p>This works on Windows / PC, Mac, iOS, Android, Amazon Kindle, and most any other device with a browser. </p> 
              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">Security?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
               <p>We don’t currently store your stream key, and we never see your twitch password when you log in. When you log in, twitch confirms your password is correct, and if it is, it sends you back to our site and gives us a little code that says “this person is logged in, and this is his username, his email, the game he is playing, etc”, but doesn’t give us your twitch password. Also, this bit of code is reset and different every time you log in to the app. The streamkey, we do get from Twitch, but do not store. All of the permissions we ask for when you “accept” on the twitch “first time” login, correspond to some feature the app uses.</p> 
              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Much Does it Cost?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
               <p>The app as is, is free to use. It is a work in progress (very early alpha stage), and at one point we may introduce either special features that you pay for, or a “pro” paid version that includes the features. If and when the time comes, we will still be offering and supporting the free version. Even the free version will include a ton of features.</p> 
              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">What are the Long Term Plans?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
               <p>Assuming the product is loved and catches traction, I will keep adding features. I have a ton of features planned for it in the case it is a success. Some of these features include things that I have not seen other products do, but I need to see that people are interested in the product in order to devote the time required to it. If enough of you guys like it, I will work on it every day and constantly add features until it is hands down the superior product for all possible twitch/ OBS needs.</p> 
              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">What is the Current Stage of Development?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
               <p>As mentioned, it is in extremely early alpha stage, but the features mentioned earlier are all working already. The site itself is still largely empty (only has home page, add will add the typical tabs later). This means the site itself, as well as the app, is still unfinished and a work in progress, but it is open now. As I develop it further, it will look better, work better, have more features, have less crashes etc, so by using it, you acknowledge that it may be buggy etc so please don’t hold that against it. I will mention known bugs/glitches, but feel free to report issues not on the “known” list. The is a part of why I am releasing at this stage. It works enough to where it can offer a service to you, and is also at the stage where it needs testing. </p> 
              </div>
            </Collapsible>
            <div><h2>How-To</h2></div>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Do I Unlock the Bot Commander?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
              <p>To unlock use of the Bot Commands, you must obtain an OAUTH token with elevated privilages for being able to message your chat as yourself (the Bot uses your own account for conveninece to message in your own chat).
                 This link will request an OAUTH token that includes the "chat:edit" scope, in addition to the scopes indluded in the other login. Use the "with chat edit privilages" link.</p> 

              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Do I Control with Wireless / Secondary Device?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
              <p>Just make sure your second device is connected to the same network as the machine with OBS is. Then, on the machine runnning OBS, 
                log in to <a href="http://streampanel.app" target="_blank">StreamPanel.app</a> and click the “update” button on bottom left. Then, click 
                “this machine has OBS”. With that, we will know which device has OBS, and save it. Now you can login on any device (with the same twitch account 
                you used for the OBS machine), and it will automatically find OBS and connect.</p> 

              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Do I Update the Twitch Stream Title and Game / Category?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
              <p>In the app, click “update”, and then fill out the “Enter Game / Category” field and the “Enter title” field. If you leave one empty, it will only change the one you fill out. 
</p> 

              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Do I Do a Test Stream?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
              <p>Just hit “test stream” instead of “start stream”. You can then stop the test stream with either of the two buttons.</p> 

              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Do I Have the App Put My Streamkey Into OBS for Me?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
              <p>You don’t have to do anything. The app will always auto get your current stream key when you click “test stream” or “start stream”.</p> 

              </div>
            </Collapsible>
            <Collapsible  transitionTime={200} trigger={<div className="collapse">How Do I Moderate Users (Ban, Timeout, Mod etc)?<i className="material-icons">arrow_drop_down</i></div>}>
              <div className="collapse-content">
              <p>When someone chats, you can click their message, and it will bring up a menu of options for that user (mod, unmod, ban, etc).</p> 

              </div>
            </Collapsible>
      
      
            </div>

            
        </div>
        <footer className="page-footer purple darken-4">
          <div className="container ">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">Follow Us On Twitter</h5>
                <p className="grey-text text-lighten-4">Keep up with new updates, and announcements. We are always looking at feedback as well.</p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">Links</h5>
                <ul>
                  <li><a className="grey-text text-lighten-3" href="https://twitter.com/stream_panel" target="_blank">Twitter</a></li>
                  <li><a className="grey-text text-lighten-3" href="mailto:streampanelapp@gmail.com" target="_blank">Contact</a></li>
                  <li><a className="grey-text text-lighten-3" href="https://youtube.com" target="_blank">Youtube</a></li>
                  
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            © 2019, StreamPanel
            {/* <a className="grey-text text-lighten-4 right" href="#!">More Links</a> */}
            </div>
          </div>
        </footer>
      </div>
        
    );
    

}

export default about