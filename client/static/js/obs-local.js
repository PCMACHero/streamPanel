// Helper Functions
function hideOpeningModal() {
    var openingModal = document.getElementById('openingModal');
    openingModal.style.display = "none";
};

function showOpeningModal() {
    var openingModal = document.getElementById('openingModal');
    openingModal.style.display = "block";
};

function setSceneButtons() {
    obs.getSceneList().then(data => {
        const sceneListDiv = document.getElementById('scenes');
        const scenesModal = document.getElementById('scenesModal');
        const modalContent = document.getElementById('scenesModalContent');
        var counter = 1;
        data.scenes.forEach(scene => {
            const sceneElement = document.createElement('button');
            sceneElement.textContent = scene.name;
            sceneElement.name = scene.name;
            sceneElement.type = "button"
            sceneElement.onclick = function () {
                console.log("switching to scene: " + scene.name);
                obs.setCurrentScene({
                    'scene-name': scene.name
                });
            };
            if (counter <= 3) {
                sceneElement.className = "mainScenes";
                sceneListDiv.appendChild(sceneElement);
            } else if (counter == 4) {
                sceneElement.className = "modalScenes";
                // Generate modal button
                const modalButton = document.createElement('button');
                const closeButton = document.getElementById('scenesCloseBtn');
                modalButton.textContent = "Other Scenes";
                modalButton.id = "scenesModalButton";
                modalButton.type = 'button';
                modalButton.className = "mainScenes";
                modalButton.onclick = function () {
                    scenesModal.style.display = "block";
                };
                closeButton.onclick = function () {
                    scenesModal.style.display = "none";
                }
                scenesModal.onclick = function (event) {
                    if (event.target == scenesModal) {
                        scenesModal.style.display = "none";
                    }
                }
                // Add modal button to scene
                sceneListDiv.appendChild(modalButton);
                // Add buttons to new modal
                modalContent.appendChild(sceneElement);
            } else if (counter > 4 || counter < 10) {
                // Just add buttons to modal
                sceneElement.className = "modalScenes";
                modalContent.appendChild(sceneElement);
            } else {
                return;
            }
            counter++;
        });
    });
};

function setProfile() {
    obs.getCurrentProfile().then(profile => {
        let previous = document.getElementById('selectedProfileBtn');
        previous.id = "";
        const list = document.getElementsByName(profile['profile-name']);
        list[0].id = "selectedProfileBtn";
        console.log("profile", list[0].id);
    });
}

function setProfiles() {
    var current;
    obs.getCurrentProfile().then(profile => {
        current = profile.profileName;
    });
    obs.listProfiles().then(profiles => {
        const profilesDiv = document.getElementById('profileBtns');
        let count = 1;
        profiles.profiles.forEach(profile => {
            if (count == 9) {
                return;
            }
            const profileBtn = document.createElement('button');
            profileBtn.textContent = profile['profile-name'];
            profileBtn.name = profile['profile-name'];
            profileBtn.type = 'button';
            profileBtn.className = 'profileBtn';
            if (profile['profile-name'] == current) {
                profileBtn.id = "selectedProfileBtn";
            }
            // Add event listener

            profileBtn.onclick = function () {
                obs.setCurrentProfile({ "profile-name": profileBtn.textContent });
            }

            profilesDiv.appendChild(profileBtn);
            count++;
        });
    });
};

// TODO: Resize iframe to fit content

function setSources() {
    // clear all of the sets
    camSet.clear();
    audioSet.clear();
    sourcesSet.clear();
    specialSet.clear();
    volumeSet.clear();

    totalSources = 0;

    // Clear sources modal content
    const audioDiv = document.getElementById('audioSources');
    const videoDiv = document.getElementById('videoSources');
    const etcDiv = document.getElementById('etcSources');
    const volDiv = document.getElementById('volSliders');
    audioDiv.innerHTML = "";
    videoDiv.innerHTML = "";
    etcDiv.innerHTML = "";
    volDiv.innerHTML = "";

    // Set the main mic
    // if(specialSet.size < 1) {
    obs.getSpecialSources().then(mic => {
        console.log("special mic", mic);
        micName = mic["mic-1"];
        //add to the volumes div
        volumeSet.add(mic["mic-1"]);
        // Get the mute status and set the button
        getMuteStatus();

        // Set the secondary mic if there is one
        if (mic["mic-2"]) {
            // Set the secondary button on the main screen and get its mute status
            extraName = mic['mic-2'];
            extraLabel.textContent = mic["mic-2"];
            extraButtonAppear();
            // Get mute status
            getSecondaryMuteStatus();
            setSecondaryAudioButton();
            //Add to the volume set
            volumeSet.add(mic["mic-2"]);
            // Loop through the rest if there are more to add them to the audioSet
            for (var i = 3; i < 6; i++) {
                if (mic["mic-" + i]) {
                    specialSet.add(mic["mic-" + i]);
                    volumeSet.add(mic["mic-" + i]);
                    getExtraMuteStatus(mic["mic-" + i]);
                    totalSources++;
                } else {
                    break;
                }
            };
        };
    });
    // };
    obs.getSourcesList().then(response => {
        let sources = response.sources;
        camName = undefined;
        // TODO: map these to two different arrays
        for (let source of sources) {
            if (source.typeId == "av_capture_input") {
                camSet.add(source.name);
            } else if (source.typeId == "coreaudio_input_capture" && source.name != micName) {
                audioSet.add(source.name);
                volumeSet.add(source.name);
            } else {
                sourcesSet.add(source.name);
            }
        };
        // setSpecialSources();
        setAudioSources();
        getCamStatus();
        setSceneSources();
        setVolumeSliders();
    });
};

function getExtraMuteStatus(mic) {
    obs.getMute({ 'source': mic }).then(status => {
        console.log("special third", status);
        let sourceDiv = document.getElementById('audioSources');
        const newBtn = document.createElement('button');
        newBtn.name = mic;
        newBtn.textContent = mic;
        if (status.muted == true) {
            newBtn.className = "sourceInvisible";
        } else {
            newBtn.className = "sourceVisible";
        }
        sourceDiv.appendChild(newBtn);

        // Add onclick functionality
        newBtn.onclick = function () {
            obs.toggleMute({ "source": mic }).then(item => {
                obs.getMute({ "source": mic }).then(status => {
                    if (status.muted == true) {
                        newBtn.className = "sourceInvisible";
                    } else if (status.muted == false) {
                        newBtn.className = "sourceVisible";
                    }
                });
            });
        };
    });
};

function getSecondaryMuteStatus() {
    obs.getMute({ 'source': extraName }).then(status => {
        if (status.muted == true) {
            extraITag.innerText = "mic_off";
        } else {
            extraITag.innerText = "mic";
        }
    });
};

function setSecondaryAudioButton() {
    // Add event listener
    extraButton.onclick = function () {
        // Get current mute status and toggle only when it doesn't equal
        // Toggle Mute
        obs.toggleMute({ 'source': extraName }).then(res => {
            getSecondaryMuteStatus();
        });
        var div2Update = document.getElementById('audioSources');

    };
};

function setAudioSources() {
    audioSet.forEach(audioSrc => {
        obs.getSceneItemProperties({ "item": audioSrc }).then(device => {
            setButton(device, "audio");
        });
    });
};

function setButton(source, sourceType) {
    if (totalSources >= 12) {
        return
    };
    totalSources++;
    switch (sourceType) {
        case "audio":
        case "Audio":
            var div2Update = document.getElementById('audioSources');
            break;
        case "video":
        case "Video":
            var div2Update = document.getElementById('videoSources');
            break;
        case "etc":
        case "Etc":
            var div2Update = document.getElementById('etcSources');
        default:
            break;
    };

    const newBtn = document.createElement('button');
    newBtn.name = source.name;
    newBtn.textContent = source.name;
    if (!source.visible) {
        newBtn.className = "sourceInvisible";
    } else {
        newBtn.className = "sourceVisible";
    }
    div2Update.appendChild(newBtn);

    // Add onclick functionality
    newBtn.onclick = function () {
        var changeTo;
        if (newBtn.className == "sourceVisible") {
            changeTo = false;
        } else if (newBtn.className == "sourceInvisible") {
            changeTo = true;
        }
        obs.setSceneItemProperties({ "item": source.name, "visible": changeTo }).then(item => {
            console.log("special", item);
            if (item.status == "ok") {
                if (changeTo) {
                    newBtn.className = "sourceVisible";
                } else {
                    newBtn.className = "sourceInvisible";
                }
            }
        });
    };
};

function getMuteStatus() {
    //go through mic set to find one that is live, the rest get added to sources
    obs.getMute({ 'source': micName }).then(status => {
        if (status.muted == true) {
            muted = true;
            console.log("muted", muted);
            // set muteButton
            muteButton.className = "mute";
            muteITag.innerText = "mic_off";
        } else {
            muted = false;
            console.log("not muted", muted)
            //set muteButton
            muteButton.className = "unmute";
            muteITag.innerText = "mic";
        }
    });
};

function shortAsync() {
    return new Promise(res => {
        setTimeout(() => {
            res("ok go");
        }, 330);
    });
};

function extraBtnDisapper() {
    extraButton.style.display = "none";
    extraLabel.style.display = "none";
};

function extraButtonAppear() {
    extraButton.style.display = "block";
    extraLabel.style.display = "block";
};

function getCamStatus() {
    camITag.innerText = "";
    camText.textContent = "";
    camButton.className = null;
    camButton.style.display = "none";
    let tempSet = new Set([]);
    let camCount = 0;
    // Check to see if both the extraName and camSet are both empty to make the button and the label disappear
    if (extraName == undefined && camSet.size === 0) {
        extraBtnDisapper();
    };

    camSet.forEach(async cam => {
        obs.getSceneItemProperties({ 'item': cam }).then(foundCam => {
            console.log('got cam', foundCam);
            camCount++;
            if (camCount == 1) {
                // Set the first cam on the main view and put the rest back
                camName = foundCam.name;
                camText.textContent = foundCam.name;
                if (foundCam.visible) {
                    camButton.className = "camVisible";
                    camITag.innerText = "videocam";
                    camButton.style.display = "block";
                } else {
                    camButton.className = "camInvisible";
                    camITag.innerText = "videocam_off";
                    camButton.style.display = "block";
                }
            } else {
                // Check if the secondary button is set
                if (extraName == undefined) {
                    extraName = foundCam.name;
                    extraLabel.textContent = foundCam.name;
                    extraButtonAppear();
                    // Calls function that sets the button listener and icon
                    setCamAsSecondary(foundCam);
                };
                setButton(foundCam, "video");
            }
        });
        let rest = await shortAsync();
    });
    if (camName == undefined) {
        camText.innerText = "";
        camButton.className = null;
        camButton.style.display = "none";
    }
};

function setCamAsSecondary(camInput) {
    // Set the label
    extraLabel.textContent = extraName;
    // Set the type of icon after finding out the current visibility
    // Set the className
    if (camInput.visible == true) {
        extraITag.innerText = "videocam";
        extraButton.className = "camVisible";
    } else {
        extraITag.innerText = "videocam_off";
        extraButton.className = "camInvisible";
    }

    // Add the event listener
    extraButton.onclick = function () {
        if (extraButton.className == "camVisible") {
            obs.setSceneItemProperties({ 'item': camName, 'visible': false }).then(res => {
                camITag.textContent = "videocam_off"
                extraButton.className = "camInvisible";
            });
        } else if (extraButton.className == "camInvisible") {
            obs.setSceneItemProperties({ 'item': camName, 'visible': true }).then(res => {
                camITag.textContent = "videocam";
                extraButton.className = "camVisible";
            });
        }
    };
};

function setSceneSources() {
    sourcesSet.forEach(source => {
        obs.getSceneItemProperties({ "item": source }).then(foundSrc => {
            setButton(foundSrc, "etc");
        });
    });
};

function setVolumeSliders() {
    const div = document.getElementById('volSliders');
    volumeSet.forEach(source => {
        const newDiv = document.createElement('div');
        newDiv.className = "sliderHolder";
        div.appendChild(newDiv);
        const slider = document.createElement('input');
        slider.type = "range";
        slider.min = 0;
        slider.max = 120;
        slider.name = source;
        slider.className = "slider";
        newDiv.appendChild(slider);
        const colorDiv = document.createElement('div');
        colorDiv.className = "colorStatus";
        newDiv.appendChild(colorDiv);
        const volDisplay = document.createElement('div');
        volDisplay.className = "volDisplay";
        colorDiv.appendChild(volDisplay);
        for (var i = 0; i < 9; i++) {
            const p = document.createElement('p');
            p.innerText = "____";
            p.className = "levelsP";
            volDisplay.appendChild(p);
        }
        const tag = document.createElement('p');
        tag.className = "volName";
        tag.innerText = source;
        newDiv.appendChild(tag);
        slider.addEventListener('input', function() {
            let difference = slider.value / 120 * 100;
            // call obs
            let negValue = -1 * slider.value;
            let ratio = Math.pow(10, (negValue / 20));
            obs.setVolume({'source': slider.name, 'volume': ratio}).then(res => {
                console.log(res);
            });
            volDisplay.style.background = `linear-gradient(#19104a ${difference}%, #4576e6 ${difference}%)`;
        });

        obs.getVolume({'source': source}).then(status => {
            let difference;
            if (status.volume != 0) {
                let db = Math.round(20 * Math.log10(status.volume));
                difference = -1 * db / 120 * 100;
                slider.value = -1 * db;
            } else {
                difference = 0;
                slider.value = 120;
            }
            volDisplay.style.background = `linear-gradient(#19104a ${difference}%, #4576e6 ${difference}%)`;
        });
    });
    let spare = 7 - volumeSet.size;
    for(let i = spare; i > 0; i--) {
        const newDiv = document.createElement('div');
        newDiv.className = "sliderHolder";
        newDiv.style.background = "rgba(0, 0, 0, 0.589)";
        div.appendChild(newDiv);
        const slider = document.createElement('input');
        slider.type = "range";
        slider.min = 0;
        slider.max = 100;
        slider.value = 100;
        slider.className = "slider";
        newDiv.appendChild(slider);
        const colorDiv = document.createElement('div');
        colorDiv.className = "colorStatus";
        newDiv.appendChild(colorDiv);
        const volDisplay = document.createElement('div');
        volDisplay.className = "volDisplay";
        colorDiv.appendChild(volDisplay);
        const tag = document.createElement('p');
        tag.className = "volName";
        tag.innerText = " ";
        tag.style.backgroundColor = "rgb(65, 65, 65, 0.589)";
        newDiv.appendChild(tag);
    }
};

// const sceneListDiv = document.getElementById('scenes');
//         const scenesModal = document.getElementById('scenesModal');
//         const modalContent = document.getElementById('scenesModalContent');
//         var counter = 1;
//         data.scenes.forEach(scene => {
//             const sceneElement = document.createElement('button');
//             sceneElement.textContent = scene.name;
//             sceneElement.name = scene.name;
//             sceneElement.type = "button"
//             sceneElement.onclick = function () {
//                 console.log("switching to scene: " + scene.name);
//                 obs.setCurrentScene({
//                     'scene-name': scene.name
//                 });
//             };

function setProfilesModal() {
    var profModal = document.getElementById('profilesModal');
    var btn = document.getElementById("profilesModalBtn");
    var span = document.getElementById("profileCloseBtn");

    btn.onclick = function () {
        profModal.style.display = "block";
    }
    span.onclick = function () {
        profModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the profModal, close it

    profModal.onclick = function (event) {
        if (event.target == profModal) {
            profModal.style.display = "none";
        }
    }
};

function setSourcesModal() {
    var modal = document.getElementById('sourcesModal');
    var btn = document.getElementById("addSource");
    var span = document.getElementById("sourcesCloseBtn");

    btn.onclick = function () {
        modal.style.display = "block";
    };
    span.onclick = function () {
        modal.style.display = "none";
    };
    modal.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};

function setVolumeModal() {
    var modal = document.getElementById('volModal');
    var content = document.getElementById('volumes');
    var btn = document.getElementById('volModalButton');
    btn.onclick = function () {
        modal.style.display = "block";
    };
    modal.onclick = function(e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    };
    // let colorArr1 = ["#545468", "rgb(66, 66, 66)"];
    // let colorArr2 = ["rgb(66, 66, 66)", "#545468"];
    // let percent = 1;
    // let backStr = "#1d1d20 0%, ";
    // for(var i = 0; i < 100; i++) {
    //     if (i % 2 === 0) {
    //         backStr += colorArr1[0] + " " + percent + "%, " + colorArr1[1] + " " + percent + "%, "
    //     } else {
    //         backStr += colorArr2[0] + " " + percent + "%, " + colorArr2[1] + " " + percent + "%, "
    //     }
    //     percent += 1;
    // }
    // let gradient = "linear-gradient(" + backStr + ");";
    // console.log("cool", gradient);
};

function addEventListeners() {
    // Add DOM event listeners to mic button
    muteButton.addEventListener("click", function () {
        console.log('mic clicked, ', muted);

        obs.toggleMute({ 'source': micName }).then(res => {
            getMuteStatus();
        });
    });

    // DOM Event Listener for Stream
    streamButton.addEventListener("click", function () {
        console.log("Stream Button Clicked");
        if (streamLabel.innerText == "Start Stream") {
            // send obs command
            obs.startStreaming().then(data => {
                console.log("Start Stream!");
                // change variables and button class
                streamITag.innerText = "stop";
                streamLabel.innerText = "Stop Stream";
                streamButton.className = "streamLive";
            })
        } else {
            obs.stopStreaming().then(response => {
                console.log("Stopped Stream");
                streamButton.className = "streamOff";
                streamITag.innerText = "play_arrow";
                streamLabel.innerText = "Start Stream";
            })
        }
    });

    camButton.addEventListener("click", function () {
        if (camButton.className == "camVisible") {
            obs.setSceneItemProperties({ 'item': camName, 'visible': false }).then(res => {
                camITag.textContent = "videocam_off"
                camButton.className = "camInvisible";
            });
        } else if (camButton.className == "camInvisible") {
            obs.setSceneItemProperties({ 'item': camName, 'visible': true }).then(res => {
                camITag.textContent = "videocam";
                camButton.className = "camVisible";
            });
        }
    });
};

myRound = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};