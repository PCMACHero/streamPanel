// function createCORSRequest(method, url) {
//     var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr) {
  
//       // Check if the XMLHttpRequest object has a "withCredentials" property.
//       // "withCredentials" only exists on XMLHTTPRequest2 objects.
//       xhr.open(method, url, true);
  
//     } else if (typeof XDomainRequest != "undefined") {
  
//       // Otherwise, check if XDomainRequest.
//       // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
//       xhr = new XDomainRequest();
//       xhr.open(method, url);
  
//     } else {
  
//       // Otherwise, CORS is not supported by the browser.
//       xhr = null;
//     }
//     return xhr;
//     }
    
//     var xhr = createCORSRequest('GET', url);
//     if (!xhr) {
//         throw new Error('CORS not supported');
//     }

function setTable(custom) {
    setTimeout(function() {
        $('.grid').css('display', 'grid');
    }, 1000)
    $('#setup').click(function() {
        $('#setupModal').css('display', 'block');
        $('#footer').css('display', 'none');
    });
    $('#setupModal').click(function(e) {
        if(e.target.id == "setupModal") {
            $(this).css('display', 'none');
            $('#footer').css('display', 'block');
        }
    });
    $('#setupCloseBtn').click(function() {
        $('#setupModal').css('display', 'none');
        $('#footer').css('display', 'block');
    });
    $('#contact').click(function() {
        $('#contactModal').css('display', 'block');
        $('#footer').css('display', 'none');
    });
    $('#contactModal').click(function(e) {
        if(e.target.id == "contactModal") {
            $(this).css('display', 'none');
            $('#footer').css('display', 'block');
        }
    });
    $('#contactCloseBtn').click(function() {
        $('#contactModal').css('display', 'none');
        $('#footer').css('display', 'block');
    });
    var dName = $('#userName').text();
    $('#daddy').click(function() {
        window.location.href = `/user/${dName}/app`;
    });
    $('#submit').click(function() {
        if ($('#messageArea').val().length > 4) {
            $('#messageArea').val("sending...");
            setTimeout(() => {
                $('#messageArea').css('color', 'green');
                $('#messageArea').val("Thank you for your message.");
            }, 1500);
        }
    });
    $('#update').click(function() {
        $('#input').css('display', 'none');
        $('#privateIp').css('display', 'block');
        $('#manualUpBtn').css('display', 'none');
        $('#topLabel').css("display", "block");
        $('#alertModal').css('display', 'block');
        // Update text
        $('#topLabel').text('Updating your local IP...');
        // Start a timer to check if the ip has been found, if not present an input.
        setTimeout(function() {
            if($('#topLabel').text() == "Updating your local IP...") {
                $('#resLabel').css('color', 'red');
                $('#resLabel').text('Could not find local ip. Try a different browser or if you know it enter it above.');
                // present an input
                $('#input').css('display', 'block');
                $('#privateIp').css('display', 'none');
                // present the button
                $('#manualUpBtn').css('display', 'block');
                // change top label
                $('#topLabel').css("display", "none");
            }
        }, 5000);
        // Make call to server to update the db
        //get the IP addresses associated with an account
        function getIPs(callback){
            var ip_dups = {};
            //compatibility for firefox and chrome
            var RTCPeerConnection = window.RTCPeerConnection
                || window.mozRTCPeerConnection
                || window.webkitRTCPeerConnection;
            var useWebKit = !!window.webkitRTCPeerConnection;
            //bypass naive webrtc blocking using an iframe
            if(!RTCPeerConnection){
                //NOTE: you need to have an iframe in the page right above the script tag
                //
                //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
                //<script>...getIPs called in here...
                //
                var win = iframe.contentWindow;
                RTCPeerConnection = win.RTCPeerConnection
                    || win.mozRTCPeerConnection
                    || win.webkitRTCPeerConnection;
                useWebKit = !!win.webkitRTCPeerConnection;
            }
            //minimal requirements for data connection
            var mediaConstraints = {
                optional: [{RtpDataChannels: true}]
            };
            var servers = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
            //construct a new RTCPeerConnection
            var pc = new RTCPeerConnection(servers, mediaConstraints);
            function handleCandidate(candidate){
                //match just the IP address
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
                var ip_addr = ip_regex.exec(candidate)[1];
                //remove duplicates
                if(ip_dups[ip_addr] === undefined)
                    callback(ip_addr);
                ip_dups[ip_addr] = true;
            }
            //listen for candidate events
            pc.onicecandidate = function(ice){
                //skip non-candidate events
                if(ice.candidate)
                    handleCandidate(ice.candidate.candidate);
            };
            //create a bogus data channel
            pc.createDataChannel("");
            //create an offer sdp
            pc.createOffer(function(result){
                //trigger the stun server request
                pc.setLocalDescription(result, function(){}, function(){});
            }, function(){});
            //wait for a while to let everything done
            setTimeout(function(){
                //read candidate info from local description
                var lines = pc.localDescription.sdp.split('\n');
                lines.forEach(function(line){
                    if(line.indexOf('a=candidate:') === 0)
                        handleCandidate(line);
                });
            }, 1000);
        }
            //test ips and update user and server
            getIPs(async function(ip){
                const text = ip;
                //local IPs
                if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
                    $('#privateIp').text(text);
                    $('#topLabel').text("Found ip. Updating SD's servers...");
                    let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "POST", url: "/newIp", body: 'ip='.concat(text)});
                    let resFromDB = JSON.parse(response);
                    if (resFromDB.message == "Success" && resFromDB.ip == text) {
                        $('#topLabel').text("Your info has been saved.");
                        $('#resLabel').css('color', 'green');
                        $('#resLabel').text('Successfully updated your local IP!');
                    } else {
                        $('#resLabel').css('color', 'red');
                        $('#resLabel').text('Error updating -- '.concat(resFromDB.error));
                    }
                }
                //IPv6 addresses
                else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/))
                    console.log(text);
                //assume the rest are public IPs
                else
                    console.log(text);
            });
        });
        $('#alertModal').click(function(e) {
            if(e.target.id == "alertModal") {
                $(this).css('display', 'none');
            }
        });
        $('#alertBtn').click(function() {
            $('#alertModal').css('display', 'none');
        });
        $('#manualUpBtn').click(async function() {
            if($('#input').val().length > 6) {
                let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "POST", url: "/newIp", body: 'ip='.concat($('#input').val())});
                let resFromDB = JSON.parse(response);
                if (resFromDB.message == "Success") {
                        $('#resLabel').css('color', 'green');
                        $('#resLabel').text('Successfully updated your local IP!');
                    } else {
                        $('#resLabel').css('color', 'red');
                        $('#resLabel').text('Error updating -- '.concat(resFromDB.error));
                    }
            }
        });
        $('#add2Screen').click(function() {
            $('#imgModal').css('display', 'block');
        });
        $('#imgModal').click(function(e) {
            if(e.target.id == "imgModal") {
                $('#imgModal').css('display', 'none');
            }
        });
        $('#customize').click(function() {
            $('#customModal').css('display', 'block');
        });
        $('#customCloseBtn').click(function() {
            $('#customModal').css('display', 'none');
            $('#sdRemote').css('display', 'grid');
        });
        $('#customModal').click(function(e) {
            if(e.target.id == "customModal") {
                $('#customModal').css('display', 'none');
            }
        });
        $('#customTemp').click(function() {
            $('#twitter').css('display', 'none');
            $('#sdRemote').css('display', 'grid');
        });
        $('#twitterHeader').click(function() {
            $('#sdRemote').css('display', 'none');
            $('#twitter').css('display', 'block');
        });
        $('#signupTwitter').click(function() {
            let headers = {'Content-type': 'application/x-www-form-urlencoded',
                "oauth_nonce": "K7ny27JTpKVsTgdyLdDfmQQWVLERj2zAK5BslRsqyw",
                "oauth_callback": "/twitter",
                "oauth_signature_method": "HMAC-SHA1", 
                "oauth_timestamp": "1300228849", 
                "oauth_consumer_key": "ylqncOOxTRzZQ6vX1ZGkGdojY", 
                "oauth_signature": "Pc%2BMLdv028fxCErFyi8KXFM%2BddU%3D", 
                "oauth_version": "1.0",
                "Access-Control-Allow-Origin": window.location.protocol + '//' + window.location.host,
                "Access-Control-Allow-Headers": ["X-Requested-With", "Content-type"],
                "Access-Control-Allow-Methods":  "PUT, GET, POST, DELETE, OPTIONS"
            }
            let response = request({headers: headers, method: "POST", url: "https://api.twitter.com/oauth/request_token", credentials: true});
            console.log(response);
        });
        $('.i').click(function() {
            $('#selectedI').attr('id', null);
            $(this).attr('id', 'selectedI');
            console.log($(this).text());
        });
        $('#create').click(async function() {
            if($('#command').val().length > 0 && $('#title').val().length > 0) {
                if($('#selectedI').text().length > 0) {
                    // submit
                    let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "POST", url: "/new-button", body: 'title='.concat($('#title').val() + "&command=".concat($('#command').val() + "&icon=".concat($('#selectedI').text())))});
                    let resFromDB = JSON.parse(response);
                    if (resFromDB.message == "Success") {
                        // create new button
                        console.log(resFromDB);
                        $('#currBtns').html(function() {
                            return "";
                        });
                        displayCustom(resFromDB.data);
                        $('#instr').text("You have successfully created a button!")
                        $('#command').val("");
                        $('#title').val("");
                        $('#selectedI').attr('id', null);
                    } else {
                        // inform the user
                        console.log(resFromDB);
                    }
                } else {
                    $('#instr').text(function() {
                        return "Please select an Icon";
                    });
                }
            } else {
                $('#instr').text(function() {
                    return "Please enter a command and title";
                });
            }
        });
        $('#smModalClose').click(function() {
            $('#smModal').css('display', 'none');
        });
        $('#smModal').click(function(e) {
            if(e.target.id == "smModal") {
                $('#smModal').css('display', 'none');
            }
        });

        $('#addNav').click(function() {
            $('#current').css('display', 'none');
            $('#createBtn').css('display', 'grid');
            $('#sdRHeader1').text("Customize your buttons!");
            if(custom.length == 3) {
                $('#instr').text("Your custom buttons list is full with 3.");
            } else {
                $('#instr').text("Select the icon and set the title and bot command below (Max 3 buttons).");
            }
        });

        $('#delNav').click(function() {
            $('#current').css('display', 'block');
            $('#createBtn').css('display', 'none');
            $('#sdRHeader1').text("Your current buttons:");
            $('#instr').text("Click on any button below to delete it.");
        });
        
        // iterate through custom buttons for user to edit
        displayCustom(custom);
}

function displayCustom(btns) {
    //add event listeners
    // iterate through each custom button
    for(var i in btns) {
        // create new div
        const nDiv = document.createElement('div');
        nDiv.id = "custom" + i;
        // create new button and itag
        const newBtn = document.createElement('button');
        const newI = document.createElement('i');
        newI.className = "material-icons newI";
        newI.innerText = btns[i].icon;
        newBtn.appendChild(newI);
        // create new title tag
        const newT = document.createElement('p');
        newT.innerText = btns[i].title + " / " + btns[i].command;
        // append children
        nDiv.appendChild(newBtn);
        nDiv.appendChild(newT);
        nDiv.addEventListener('click', function() {
            presentModal(nDiv.id[6]);
        });
        $('#currBtns').append(nDiv);
    }
}

function presentModal(elem) {
    $('#smModal').css('display', 'block');
    $('#smBtn').off();
    $('#smBtn').click(async function() {
        // send to delete from db
        let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "Delete", url: "/new-button/" + elem});
        let resFromDB = JSON.parse(response);
        if(resFromDB.message = "success" && !resFromDB.error) {
            //reload buttons
            console.log(resFromDB);
            $('#currBtns').html(function() {
                return "";
            });
            displayCustom(resFromDB.data);
            if(resFromDB.data.length == 3) {
                $('#instr').text("Your custom buttons list is full with 3.");
            }
            $('#smModal').css('display', 'none');
        } else {
            console.log(resFromDB);
        }
    });
}

// res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", "X-Requested-With");
// res.header("Access-Control-Allow-Headers", "Content-Type");
// res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
