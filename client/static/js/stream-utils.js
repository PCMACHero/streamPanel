var gameDisplay = document.getElementById('gameName');
var streamDisplay = document.getElementById('streamTitleText');

let request = obj => {
  return new Promise(((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open(obj.method || "GET", obj.url);
      if (obj.headers) {
          Object.keys(obj.headers).forEach(key => {
              xhr.setRequestHeader(key, obj.headers[key]);
          });
      }
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
          } else {
              reject(xhr.statusText);
          }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(obj.body || null);
  }));
};

function getGameStreamInfo() {
  return new Promise(((resolve, reject) => {
    request({headers: {"Client-Id": "1w72cq9l8ub9r1pzuqrh91pwduz8r2"}, url: "https://api.twitch.tv/helix/streams?user_login=".concat(displayName)}).then(data => {
      var myStreamObj = JSON.parse(data);
        if (myStreamObj["data"].length > 0) {
          myTitle = myStreamObj["data"][0]["title"];
          myViewcount = myStreamObj["data"][0]["viewer_count"];
          myGameId = myStreamObj["data"][0]["game_id"];
          myLiveStatus = myStreamObj["data"][0]["type"];
          myThumbnail = myStreamObj["data"][0]["thumbnail_url"];
  
          document.getElementById("streamTitleText").innerHTML = myTitle;
          document.getElementById('streamTtlUpdate').value = myTitle;
          document.getElementById("viewcountText").innerHTML = myViewcount;
          // For testing purposes:
          // testTimer = setInterval(function() {updateViewCount()}, 30000)
          request({url: "https://api.twitch.tv/helix/games?id=" + myGameId, headers: {"Client-Id": "1w72cq9l8ub9r1pzuqrh91pwduz8r2"}}).then(gameData => {
            var myStreamObj2 = JSON.parse(gameData);
            if (myStreamObj2["data"].length > 0) {
              myGameName = myStreamObj2["data"][0]["name"];
              document.getElementById("gameName").innerHTML = myGameName;
              document.getElementById('gameTtlUpdate').value = myGameName;
              resolve({message: "Success", data: [myStreamObj, myStreamObj2]});
            } else {
              resolve({message: "Error", error: "couldn't find game name", data: myStreamObj});
            }
            });
        } else {
          resolve({message: "Error", error: "No data returned"});
        }
    });
  }));
};

function updateViewCount() {
  request({headers: {"Client-Id": "1w72cq9l8ub9r1pzuqrh91pwduz8r2"}, url: "https://api.twitch.tv/helix/streams?user_login=".concat(displayName)}).then(data => {
    var myStreamObj = JSON.parse(this.responseText);
    if (myStreamObj["data"].length > 0) {
      myTitle = myStreamObj["data"][0]["title"];
      myViewcount = myStreamObj["data"][0]["viewer_count"];
      myGameId = myStreamObj["data"][0]["game_id"];
      myLiveStatus = myStreamObj["data"][0]["type"];
      myThumbnail = myStreamObj["data"][0]["thumbnail_url"];
  
      document.getElementById("streamTitleText").innerHTML = myTitle;
      document.getElementById('streamTtlUpdate').value = myTitle;
      document.getElementById("viewcountText").innerHTML = myViewcount;
    }
  });
};

async function triesChannelInfo() {
  getGameStreamInfo().then(res => {
    if(res.error) {
      //function will recursively call itself
      if(res.error == "couldn't find game name") {
        gameDisplay.innerText = "Game Name not set";
      } else {
        console.log(gameDisplay);
        gameDisplay.innerText = "Waiting on a response from Twitch";
        streamDisplay.innerText = "May take a few mins";
      }
      setTimeout(function() {triesChannelInfo()}, 15000);
    }
  });
};

function startTimerLabel() {
    minutes++;
    if (minutes == 60) {
        hours++;
        minutes = 0;
    }
    if (minutes < 10) {
        minutesStr = "0" + minutes;
    } else {
        minutesStr = minutes.toString();
    }
    if (hours < 10) {
        hoursStr = "0" + hours;
    } else {
        hoursStr = hours.toString();
    }
    timerLabel.innerText = hoursStr + "hrs " + minutesStr + "min";
}

function stopTimerLabel() {
    clearInterval(timer);
}

// Additional functions

async function streamAndTitleListeners() {
    var strTitle = document.getElementById('streamTitleText');
    var gmTitle = document.getElementById('gameName');
    
    // Get the modal
    var strModal = document.getElementById('streamTtlModal');
    var gmModal = document.getElementById('gameTtlModal');
    
    // Get the <span> element that closes the modal
    var strCloseBtn = document.getElementById("streamCloseButton");
    var gmCloseBtn = document.getElementById("gameCloseButton");
    
    strTitle.addEventListener('click', function() {
        strModal.style.display = "block";
    });

    gmTitle.addEventListener('click', function () {
        gmModal.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    strCloseBtn.onclick = function() {
        strModal.style.display = "none";
    }
    gmCloseBtn.onclick = function () {
        gmModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the strModal, close it
    // strModal.ontouchend = function (event) {
    //     if (event.target == strModal) {
    //         strModal.style.display = "none";
    //     }
    // }
    strModal.onclick = function(event) {
        if (event.target == strModal) {
            strModal.style.display = "none";
        }
    }
    // gmModal.ontouchend = function (event) {
    //     if (event.target == gmModal) {
    //         gmModal.style.display = "none";
    //     }
    // }
    gmModal.onclick = function(event) {
        if (event.target == gmModal) {
            gmModal.style.display = "none";
        }
    }
    
    // Adding button listeners to updating
    var streamSubmit = document.getElementById('updateStream');
    var streamTxt = document.getElementById('streamTtlUpdate');
    var gameSubmit = document.getElementById('updateGame');
    var gameTxt = document.getElementById('gameTtlUpdate');

    // function that changes the stream status using the Twitch api
    streamSubmit.addEventListener('click', function() {
        if(streamTxt.value.length > 0) {
            // check if game name has been set already
            // If not then send it with an empty string, else send it with gameName
            let turl = "https://api.twitch.tv/kraken/channels/".concat(twitchId);
            let body = "channel%5Bstatus%5D=" + streamTxt.value + "&channel%5Bgame%5D=" + myGameName + "&channel%5Bchannel_feed_enabled%5D=false";
            request({headers: {"Client-ID": "1w72cq9l8ub9r1pzuqrh91pwduz8r2", "Accept": "application/vnd.twitchtv.v5+json", "Authorization": "OAuth ".concat(oauth.slice(6, oauth.length)), "Content-Type": "application/x-www-form-urlencoded"}, method: "PUT", url: turl, body: body})
            .then(res => {
                let parsed = JSON.parse(res);
                // set the stream variable
                myTitle = parsed['status'];
                if(parsed['game'] != null && myGameName != parsed['game']) {
                    myGameName = parsed['game'];
                    document.getElementById('gameName').innerText = myGameName;
                }
                // set the stream title
                document.getElementById('streamTitleText').innerText = myTitle;
                // dismiss the modal
                strModal.style.display = "none";
            });
        }
    });
    // function that changes the game title on the Twitch api
    gameSubmit.addEventListener('click', function() {
        if(gameTxt.value.length > 0) {
            // check if game name has been set already
            // If not then send it with an empty string, else send it with gameName
            let turl = "https://api.twitch.tv/kraken/channels/".concat(twitchId);
            let body = "channel%5Bstatus%5D=" + myTitle + "&channel%5Bgame%5D=" + gameTxt.value + "&channel%5Bchannel_feed_enabled%5D=false";
            request({headers: {"Client-ID": "1w72cq9l8ub9r1pzuqrh91pwduz8r2", "Accept": "application/vnd.twitchtv.v5+json", "Authorization": "OAuth ".concat(oauth.slice(6, oauth.length)), "Content-Type": "application/x-www-form-urlencoded"}, method: "PUT", url: turl, body: body})
            .then(res => {
                let parsed = JSON.parse(res);
                // set the game variable
                myGameName = parsed['game'];
                //check if status has changed and update it if it has
                if(parsed['status'] != null && myTitle != parsed['status']) {
                    myTitle = parsed['status'];
                    document.getElementById('streamTitleText').innerText = myTitle;
                }
                // set the game title on screen
                document.getElementById('gameName').innerText = myGameName;
                // dismiss the modal
                gmModal.style.display = "none";
            });
        }
    });

    // set the autofill and the top games from twitch
    allGames = await getTopGames();
    autocomplete(gameTxt, allGames);
};

// Function gets the top twenty games from Twitch

function getTopGames() {
    return new Promise((resolve, reject) => {
        request({headers: {"Client-Id": "1w72cq9l8ub9r1pzuqrh91pwduz8r2"}, url: "https://api.twitch.tv/helix/games/top"}).then(res => {
            let parsed = JSON.parse(res);
            resolve(parsed['data']);
        });
    });
};

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i]['name'].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            let sng = document.createElement('strong');
            sng.innerText = arr[i]['name'].substr(0, val.length);
            b.appendChild(sng);
            b.innerHTML += arr[i]['name'].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            let nH = document.createElement('input');
            nH.type = "hidden";
            nH.value = arr[i]['name'];
            b.appendChild(nH);
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
        });
  }

// check if this is ever used anywhere...
async function updateStrGmeInfo() {
    let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "PUT", url: "/winning-str", body: 'winMsg='.concat(winMsg.slice(0, winMsg.length - 2))});
    let resFromDB = JSON.parse(response);
    if(resFromDB.message == "Success") {
      console.log('saved message as ', winMsg);
    }
};