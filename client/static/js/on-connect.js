// Timer for removing the loading screen
window.onload = function() {
    // Remove loading screen
    setTimeout(function(){ document.getElementById('loading').style.display = "none" }, 6000);
    // Add update listeners for openingModal
    addUpListeners();
};

async function setUpRemote() {
    hideOpeningModal();
    setSceneButtons();
    obs.getCurrentScene().then(data => {
        console.log('current scene: ', data.name);
        let list = document.getElementsByName(data.name);
        list[0].id = "selectedScene";
    });

    // Get Sources
    setProfilesModal();
    setSources();
    setSourcesModal();
    setVolumeModal();
    streamAndTitleListeners();
    setProfiles();

    // Get Mute Status
    getMuteStatus();

    // Get Streaming Status
    obs.getStreamingStatus().then(status => {
        if (status.streaming) {
            console.log("Stream is live!")
            // set streaming to true
            streaming = true;
            startTimerLabel();
            streamButton.className = "streamLive";
            streamITag.innerText = "stop";
            streamLabel.innerText = "Stop Stream";
        } else {
            console.log("Stream in NOT live");
            streaming = false;
            console.log(streamITag)
            streamButton.className = "streamOff";
            streamITag.innerText = "play_arrow";
            streamLabel.innerText = "Start Stream";
        }
    });

    // set clock and interval for its update
    setClock();


    // Get Stream Title and Game Title if available
    getGameStreamInfo();
};

function obsOn() {
    obs.onConnectionOpened(() => {
        // Want to test for errors connecting before hiding the modal
    });
    // OBS event listeners
    obs.on('error', err => {
        console.error('hello socket error:', err);
        // Set the overlay and change the text
    });

    obs.onSwitchScenes((data) => {
        // Make the button looked pressed
        let current = document.getElementById('selectedScene');
        current.id = null;
        let newScene = document.getElementsByName(data.sceneName);
        newScene[0].id = "selectedScene";

        // Set sources
        setSources();
    });

    obs.onProfileChanged((data) => {
        // Make the button looked pressed
        setProfile();
        //Check mute status
        getMuteStatus();
    });

    obs.onStreamStarting((data) => {
        console.log("stream starting", data);
        // Start counter
        timer = setInterval(function () { startTimerLabel() }, 60000);
        // Set labels
        streamButton.className = "streamLive";
        streamITag.innerText = "play_arrow";
        streamLabel.innerText = "Stop Stream";
        // Get stream info from Twitch - 
        triesChannelInfo();
        // Start a timer to check every minute viewercounts
        updateTimer = setInterval(function () { updateViewCount() }, 60000);
        // Check mute status
        getMuteStatus();
    });

    obs.onStreamStopping((data) => {
        clearInterval(timer);
        timer = undefined;
        clearInterval(updateTimer);
        updateTimer = undefined;

        streamButton.className = "streamOff";
        streamITag.innerText = "stop";
        streamLabel.innerText = "Start Stream";
    });

    obs.onSceneItemVisibilityChanged(item => {
        // check mute status
        getMuteStatus();
        // check if its the main cam
        if (item.itemName == camName) {
            if (item.itemVisible && camButton.className == 'camInvisible') {
                camButton.className = "camVisible";
            } else if (!item.itemVisible && camButton.className == "camVisible") {
                camButton.className = "camInvisible";
            }
        }

        // TODO: try to figure out how to grab the other source buttons on the modal 
        // Name sounds dangerous because other items on the page could have the same name
    });
}

function passwordNeeded() {
    // This modal gets presented when a password is given by the user
    let modal = document.getElementById('openingModalContent');
    modal.style.fontFamily = "Arial";
    modal.style.letterSpacing = "1px";
    modal.style.background = "transparent";
    let d = document.createElement('div');
    d.className = "passwordDiv";
    let h = document.createElement('h1');
    h.id = "mainInstruction";
    h.innerText = "Please provide your OBS Password";
    let p = document.createElement('p');
    p.className = "passwordInstructions";
    p.innerText = "Password settings can be found in 'Tools' > 'Websocket server settings'";
    let i = document.createElement('input');
    i.type = "password";
    i.className = "passwordInput";
    let b = document.createElement('button');
    b.innerText = "Set";
    b.id = "passwordBtn";
    let con = document.createElement('div');
    con.id = "passwordContainer";
    let ck = document.createElement('div');
    ck.id = "checkbox";
    let t = document.createElement('p');
    t.id = "check";
    t.innerText = "✔";
    ck.appendChild(t);
    let p2 = document.createElement('p');
    p2.innerText = "Click if you'd like us to save your password (optional)"
    p2.className = "checkP";
    let p3 = document.createElement('p');
    p3.innerText = "Note (if you want us to save it): For retrieval, we will need to store the password as plain text. For your protection, do not use passwords from any other application / account.";
    p3.className = "tinyP";
    con.appendChild(ck);
    con.appendChild(p2);
    modal.innerHTML = "";
    modal.appendChild(d);
    d.appendChild(h);
    d.appendChild(p);
    d.appendChild(i);
    d.appendChild(b);
    d.appendChild(con);
    d.appendChild(p3);

    // Add event listeners
    ck.addEventListener('click', function() {
        if(t.style.color == "transparent") {
            t.style.color = "#737373";
        } else {
            t.style.color = "transparent";
        }
    });
    b.addEventListener('click', function() {
        if(i.value.length > 0) {
            if(t.style.color != "transparent") {
                // submit password to server
                let f = document.createElement('form');
                f.method = "POST";
                f.action = "/update-password/".concat(userId);
                let i2 = document.createElement('input');
                i2.type = 'hidden';
                i2.name = 'password';
                i2.value = i.value;
                f.appendChild(i2);
                modal.appendChild(f);
                f.submit();
            } else {
                // use the value of the input to connect to obs
                obs = undefined;
                obs = new OBSWebSocket();
                obs.connect({ address: ip, password: i.value }, function(err) {
                    if (err) {
                        // password incorrect - inform the user
                        console.log('wrong password');
                        document.getElementById('mainInstruction').innerText = "Incorrect Password";
                        p.innerText = "The password you entered is incorrect.";
                    } else {
                        console.log('eureka! hola');
                        setUpRemote();
                    }
                });
                // let user know if there is an error
            }
        }
    });
};

var clockIn;

function setClock() {
    // this function sets the small clock below the chat.
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = new Date();
    var dDig = d.getDay();
    var day = days[dDig];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    } else if (hr == 12) {
        ampm = "pm";
    } else if (hr == 24) {
        ampm = 'am';
    }
    document.getElementById('datetime').innerText = day + " " + hr + ":" + min + ampm;
    if(clockIn == undefined) {
        setInterval(function() {updateClock()}, 60000);
    }

    function updateClock() {
        min++;
        if (min < 10) {
            min = "0" + min;
        }
        else if(min == 60) {
            hr++;
            min = "00";
            if(hr == 12) {
                if(ampm == "am") {
                    ampm = "pm";
                } else {
                    ampm = "am";
                    dDig++;
                    dDig %= 7;
                    day = days[dDig];
                }
            } else if (hr == 13) {
                hr = 1;
            }
        }
        document.getElementById('datetime').innerText = day + " " + hr + ":" + min + ampm;
    }
};