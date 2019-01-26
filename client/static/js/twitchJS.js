var bot1;
var bot2;
var bot3;
var bot4;
var bot5;
var bot6;
var bot7;
var bot8;
var bot9;
var bot10;
var bot11;
var bot12;

function setBotButtons() {
  bot1 = document.getElementById('bot1');
  bot2 = document.getElementById('bot2');
  bot3 = document.getElementById('bot3');
  bot4 = document.getElementById('bot4');
  bot5 = document.getElementById('bot5');
  bot6 = document.getElementById('bot6');
  bot7 = document.getElementById('bot7');
  bot8 = document.getElementById('bot8');
  bot9 = document.getElementById('bot9');
  bot10 = document.getElementById('bot10');
  bot11 = document.getElementById('bot11');
  bot12 = document.getElementById('bot12');

var bots = {
  "bot1": "Ban"
}

  // Set bot button event listeners
  bot1.onclick = function(e) {
    // bring up prompt and set its options
    var modal = document.getElementById('promptModalL');
    var prompt = document.getElementById('promptInstrL');
    var opt = document.getElementById('optionCon');
    var cancel = document.getElementById('opt2BtnL');
    var submit = document.getElementById('opt1BtnL');

    opt.innerHTML = "";

    // Set Content
    const sel = document.createElement('select');
    o0 = document.createElement('option');
    o0.value = "None";
    o0.innerHTML = "None";
    const o1 = document.createElement('option');
    o1.value = 600;
    o1.innerHTML = "10mins";
    const o2 = document.createElement('option');
    o2.value = 1800;
    o2.innerHTML = "30mins";
    const o3 = document.createElement('option');
    o3.value = 3600;
    o3.innerHTML = "1hr";
    const o4 = document.createElement('option');
    o4.value = 5400;
    o4.innerHTML = "1.5hrs";
    const o5 = document.createElement('option');
    o5.value = 10800;
    o5.innerHTML = "3hrs";
    sel.appendChild(o0);
    sel.appendChild(o1);
    sel.appendChild(o2);
    sel.appendChild(o3);
    sel.appendChild(o4);
    sel.appendChild(o5);
    opt.innerHTML = "";
    opt.appendChild(sel);

    prompt.innerText = "Select length of Slow Mode:";
    // Set Listeners for btns
    cancel.onclick = function() {
      modal.style.display = "none";
    };
    modal.addEventListener('click', function(e) {
      if(e.target.id == modal.id) {
        modal.style.display = "none";
      }
    });
    submit.onclick = function() {
      if(sel.value != "None") {
        const secs = sel.value || 300;
        // submit data
        tjs.slow(displayName, secs)
        .then(function(data) {
          // data returns [channel]
          console.log('data: ', data);
          modal.style.display = "none";
        })
        .catch(function(err) {
          console.log('error ', err);
        });
      } else {
        tjs.slowoff(displayName)
          .then(function(data) {
            // data returns [channel]
            console.log('data: ', data);
            modal.style.display = "none";
          })
          .catch(function(err) {
            console.log('error ', err);
          });
      }
    };
    // make modal appear
    modal.style.display = "block";
    e.preventDefault();
  };

  bot2.onclick = function(e) {
    if(sOnly == false) {
      // 
      tjs.subscribers(displayName)
        .then(function(data) {
          // data returns [channel, minutes]
          console.log('data: ', data);
        })
        .catch(function(err) {
          console.log('error ', err);
        });
      sOnly = true;
    } else {
      //
      tjs.subscribersoff(displayName)
        .then(function(data) {
          console.log('data: ', data);
        })
        .catch(function(err) {
          console.log('error ', err);
        });
      sOnly = false;
    }
    e.preventDefault();
  };

  bot3.onclick = function(e) {
    if(fOnly == false) {
      // 
      tjs.followersonly(displayName, 240)
        .then(function(data) {
          // data returns [channel, minutes]
          console.log('data: ', data);
        })
        .catch(function(err) {
          console.log('error ', err);
        });
      fOnly = true;
    } else {
      //
      tjs.followersonlyoff(displayName)
        .then(function(data) {
          console.log('data: ', data);
        })
        .catch(function(err) {
          console.log('error ', err);
        });
      fOnly = false;
    }
    e.preventDefault();
  };

  bot4.onclick = function(e) {
    //ban
    var modal = document.getElementById('banModal');
    var cBtn = document.getElementById('banCloseBtn');
    var sel = document.getElementById('choices');
    var instr = document.getElementById('banTxt');
    instr.innerText = "Select User to Ban";
    sel.innerHTML = "";
    cBtn.addEventListener('click', function() {
      modal.style.display = "none";
    });
    modal.addEventListener('click', function(e) {
      if(e.target.id == "banModal") {
        modal.style.display = "none";
      }
    });

    // setup the modal with the users
    users.forEach(user => {
      const u = generateUsers(user, "ban", modal);
      sel.appendChild(u);
    });
    modal.style.display = "block";
    e.preventDefault();
  };

  bot5.onclick = function(e) {
    //unban
    var modal = document.getElementById('promptModalL');
    var prompt = document.getElementById('promptInstrL');
    var opt = document.getElementById('optionCon');
    var cancel = document.getElementById('opt2BtnL');
    var submit = document.getElementById('opt1BtnL');
    modal.style.display = "block";
    opt.innerHTML = "";

    // Set Content
    var txt = document.createElement('input');
    txt.type = "text";
    opt.appendChild(txt);

    prompt.innerText = "Who would you like to unban?";
    // Set Listeners for btns
    cancel.onclick = function() {
      modal.style.display = "none";
    };
    modal.addEventListener('click', function(e) {
      if(e.target.id == modal.id) {
        modal.style.display = "none";
      }
    });
    submit.onclick = function() {
      if(txt.value != "") {
        // display
        tjs.unban(displayName, txt.value)
          .then(function(data) {
            console.log(data);
            modal.style.display = "none";
          }).catch(function(err) {
            console.log(err);
            prompt.innerText = txt.value + " is not banned from this channel";
          });
      }
    };
    e.preventDefault();
  };

  bot6.onclick = function(e) {
    //timeout
    var modal = document.getElementById('banModal');
    var cBtn = document.getElementById('banCloseBtn');
    var sel = document.getElementById('choices');
    var instr = document.getElementById('banTxt');
    instr.innerText = "Select the User to put in Timeout";
    sel.innerHTML = "";
    cBtn.addEventListener('click', function() {
      modal.style.display = "none";
    });
    modal.addEventListener('click', function(e) {
      if(e.target.id == "banModal") {
        modal.style.display = "none";
      }
    });

    // setup the modal with the users
    users.forEach(user => {
      const u = generateUsers(user, "timeout", modal);
      sel.appendChild(u);
    });
    modal.style.display = "block";
    e.preventDefault();
  };

  bot7.onclick = function(e) {
    //message
    var modal = document.getElementById('promptModalL');
    var prompt = document.getElementById('promptInstrL');
    var opt = document.getElementById('optionCon');
    var cancel = document.getElementById('opt2BtnL');
    var submit = document.getElementById('opt1BtnL');
    modal.style.display = "block";
    opt.innerHTML = "";

    // Set Content
    var txt = document.createElement('input');
    txt.type = "text";
    opt.appendChild(txt);

    prompt.innerText = "Write your message";
    // Set Listeners for btns
    cancel.onclick = function() {
      modal.style.display = "none";
    };
    modal.addEventListener('click', function(e) {
      if(e.target.id == modal.id) {
        modal.style.display = "none";
      }
    });
    submit.onclick = function() {
      if(txt.value != "") {
        // display
        tjs.say(displayName, txt.value)
          .then(function(data) {
            console.log(data);
            modal.style.display = "none";
          }).catch(function(err) {
            console.log(err);
            modal.style.display = "none";
          });
      }
    };
    e.preventDefault();
  };

  bot8.onclick = function(e) {
    // whisper
    var modal = document.getElementById('banModal');
    var cBtn = document.getElementById('banCloseBtn');
    var sel = document.getElementById('choices');
    var instr = document.getElementById('banTxt');
    instr.innerText = "Who do you want to whisper to?";
    sel.innerHTML = "";
    cBtn.addEventListener('click', function() {
      modal.style.display = "none";
    });
    modal.addEventListener('click', function(e) {
      if(e.target.id == "banModal") {
        modal.style.display = "none";
      }
    });

    // setup the modal with the users
    users.forEach(user => {
      const u = generateUsers(user, "whisper", modal);
      sel.appendChild(u);
    });
    modal.style.display = "block";
    e.preventDefault();
  };

  bot9.onclick = function(e) {
    // Winning msg button
    // Checks if this is the first time
    if(winMsg == undefined) {
      // bring up prompt and set its options
      var modal = document.getElementById('promptModalL');
      var prompt = document.getElementById('promptInstrL');
      var opt = document.getElementById('optionCon');
      var cancel = document.getElementById('opt2BtnL');
      var submit = document.getElementById('opt1BtnL');
      modal.style.display = "block";
      opt.innerHTML = "";

      // Set Content
      submit.innerText = "Set";
      var txt = document.createElement('input');
      txt.type = "text";
      if(svdMsg != "" && svdMsg != undefined) {
        txt.value = svdMsg;
      } else {
        txt.value = displayName;
      }
      var num = document.createElement('input');
      num.type = "number";
      opt.appendChild(txt);
      opt.appendChild(num);
  
      prompt.innerText = "Set your win-counter; your phrase and your base number";
      // Set Listeners for btns
      cancel.onclick = function() {
        modal.style.display = "none";
      };
      modal.addEventListener('click', function(e) {
        if(e.target.id == modal.id) {
          modal.style.display = "none";
        }
      });
      submit.onclick = async function() {
        if(txt.value != "") {
          score = num.value || 0;
          winMsg = txt.value + ": ";
          // save their message to the db as an array to set where the score goes if it has been changed
          if(winMsg.slice(0, winMsg.length - 2) != svdMsg) {
            let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "POST", url: "/winning-str", body: 'winMsg='.concat(winMsg.slice(0, winMsg.length - 2))});
            let resFromDB = JSON.parse(response);
            if(resFromDB.message == "Success") {
              console.log('saved win str as ', winMsg);
            }
          }
          // display
          tjs.say(displayName, winMsg.concat(score))
            .then(function(data) {
              console.log(data);
              modal.style.display = "none";
            }).catch(function(err) {
              console.log(err);
            });
        }
      };
    } else {
        score++;
        tjs.say(displayName, winMsg.concat(score))
        .then(function(data) {
          console.log(data);
        }).catch(function(err) {
          console.log(err);
        });
    }
    e.preventDefault();
  };

  // Custom bot buttons
  const hidden = document.getElementById('hidden').innerHTML;
  // go through each of the buttons and edit the tag and icon
  setCustomButtons(JSON.parse(hidden));
};

function generateUsers(user, action, modal) {
  const oDiv = document.createElement('div');
  oDiv.className = "outerBtn";
  const iDiv = document.createElement('div');
  iDiv.className = "innerBtn";
  const i = document.createElement('i');
  i.className = "material-icons";
  const op = document.createElement('p');
  op.innerText = user;
  iDiv.appendChild(i);
  iDiv.appendChild(op);
  oDiv.appendChild(iDiv);
  if(action == "ban") {
    i.innerText = "delete_forever";
    oDiv.addEventListener('click', function() {
      //present promptmodal
      const prompt = document.getElementById('promptModal');
      const instr = document.getElementById('promptInstr');
      const go = document.getElementById('opt1Btn');
      const cancel = document.getElementById('opt2Btn');
      instr.innerText = `Ban ${user}?`;
      go.innerText = "Yes";
      cancel.innerText = "No";
      prompt.style.display = "block";
      //add listeners to promptmodal
      prompt.addEventListener('click', function(e) {
        if(e.target.id == 'promptModal') {
          prompt.style.display = "none";
        }
      });
      cancel.addEventListener('click', function() {
        prompt.style.display = "none";
      });
      go.addEventListener('click', function() {
        tjs.ban(displayName, user)
        .then(function(data) {
          // data returns [channel, username, reason]
          console.log(data);
          prompt.style.display = "none";
          modal.style.display = "none";
        })
        .catch(function(err) {
          console.log(err);
          prompt.style.display = "none";
          modal.style.display = "none";
        });
      });
    });
  } else if (action == "whisper") {
      i.innerText = "message";
      oDiv.addEventListener('click', function() {
        //present promptmodal
        const prompt = document.getElementById('promptModalL');
        const instr = document.getElementById('promptInstrL');
        const go = document.getElementById('opt1BtnL');
        const cancel = document.getElementById('opt2BtnL');
        const opt = document.getElementById('optionCon');
        instr.innerText = `What do you wanna say to ${user}?`;
        go.innerText = "Send";
        cancel.innerText = "Cancel";
        // set the input
        var inp = document.createElement('input');
        inp.type = "text";
        opt.innerHTML = "";
        opt.appendChild(inp);
        prompt.style.display = "block";
        //add listeners to promptmodal
        prompt.addEventListener('click', function(e) {
          if(e.target.id == 'promptModal') {
            prompt.style.display = "none";
          }
        });
        cancel.addEventListener('click', function() {
          prompt.style.display = "none";
        });
        go.addEventListener('click', function() {
          if(inp.value != "") {
            // send
            tjs.whisper(displayName, inp.value)
            .then(function(data) {
              // data returns [username, message]
              console.log(data);
              prompt.style.display = "none";
              modal.style.display = "none";
            })
            .catch(function(err) {
              console.log(err);
              prompt.style.display = "none";
              modal.style.display = "none";
            });
          }
        });
      });
  } else if (action == "timeout") {
    i.innerText = "timer_off";
    oDiv.addEventListener('click', function() {
      //present promptmodal
      const prompt = document.getElementById('promptModalL');
      const instr = document.getElementById('promptInstrL');
      const go = document.getElementById('opt1BtnL');
      const cancel = document.getElementById('opt2BtnL');
      const opt = document.getElementById('optionCon');
      instr.innerText = `Seconds ${user} will be in timeout:`;
      go.innerText = "Submit";
      cancel.innerText = "Cancel";
      // set the input
      var inp = document.createElement('select');
      var opt1 = document.createElement('option');
      var opt2 = document.createElement('option');
      var opt3 = document.createElement('option');
      var opt4 = document.createElement('option');
      var opt5 = document.createElement('option');
      var opt6 = document.createElement('option');
      opt1.value = 300;
      opt1.innerHTML = "5mins";
      opt2.value = 900;
      opt2.innerHTML = "15mins";
      opt3.value = 1800;
      opt3.innerHTML = "30mins";
      opt4.value = 3600;
      opt4.innerHTML = "1hr";
      opt5.value = 10800;
      opt5.innerHTML = "3hrs";
      opt6.value = 86400;
      opt6.innerHTML = "24hrs";
      opt.innerHTML = "";
      inp.appendChild(opt1);
      inp.appendChild(opt2);
      inp.appendChild(opt3);
      inp.appendChild(opt4);
      inp.appendChild(opt5);
      inp.appendChild(opt6);
      opt.appendChild(inp);
      prompt.style.display = "block";
      //add listeners to promptmodal
      prompt.addEventListener('click', function(e) {
        if(e.target.id == 'promptModal') {
          prompt.style.display = "none";
        }
      });
      cancel.addEventListener('click', function() {
        prompt.style.display = "none";
      });
      go.addEventListener('click', function() {
        if(inp.value != "") {
          // submit timeout
          tjs.timeout(displayName, user, inp.value)
          .then(function(data) {
            // data returns [channel, username, seconds, reason]
            console.log(data);
            prompt.style.display = "none";
            modal.style.display = "none";
          })
          .catch(function(err) {
            console.log(err);
            prompt.style.display = "none";
            modal.style.display = "none";
          });
        }
      });
    });
  }
  return oDiv;
};

function setCustomButtons(custom) {
  var ct = 10;
  custom.forEach(btn => {
    var botId = "bot" + ct;
    var botI = "bot" + ct + "i";
    var botT = "bot" + ct + "p";
    var currBtn = document.getElementById(botId);
    var currI = document.getElementById(botI);
    var currT = document.getElementById(botT);
    currI.innerText = btn.icon;
    currT.innerText = btn.title;
    ct++;

    currBtn.onclick = function(e) {
      // send bot command
      tjs.say(displayName, btn.command)
      .then(function(data) {
        console.log(data);
      }).catch(function(err) {
        console.log(err);
      });
      e.preventDefault();
    }
  });
};