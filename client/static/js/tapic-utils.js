function setTapicListeners() {
    // EventListeners
    TAPIC.listen('notice', function (e) {
        const p = newP();
        p.innerText = e;
        writeChat(p);
    });
    TAPIC.listen('join', function (e) {
        // add to users set
        if(e != displayName) {
            users.add(e);
        }
        const p = newP();
        p.innerText = e + " has joined.";
        writeChat(p);
    });
    TAPIC.listen('part', function (e) {
        const p = newP();
        p.innerText = e + " has left the channel.";
        writeChat(p);
    });
    TAPIC.listen('clearUser', function (e) {
        users.delete(e);
        const p = newP();
        p.innerText = e + " has been timed out for "
            + e.duration + 's. Reason: ' + e.reason;
        writeChat(p);
    });
    TAPIC.listen('clearChat', function (e) {
        const p = newP();
        p.innerText = 'Chat has been cleared.';
        writeChat(p);
    });
    TAPIC.listen('host', function (e) {
        const p = newP();
        p.innerText = e + ' is hosting you.'
        writeChat(p);
    });
    TAPIC.listen('follow', function (e) {
        const p = newP();
        p.innerText = e + ' has followed you.';
        writeChat(p);
    });
    TAPIC.listen('sub', function (e) {
        const p = newP();
        p.innerText = e + ' has just subscribed!';
        writeChat(p);
    });
    TAPIC.listen('subMonths', function (e) {
        const p = newP();
        p.innerText = e.name + ' has resubbed ' + e.months + ' times!';
        writeChat(p);
    });
    TAPIC.listen('subsAway', function (e) {
        const p = newP();
        p.innerText = e + ' users have subbed since you have been offline.';
        writeChat(p);
    });
    TAPIC.listen('roomstate', function (e) {
        const p = newP();
        var output = 'Roomstate options: ';
        if (e.lang) output += ' lang:' + e.lang;
        if (e.r9k == 1) output += ' r9k';
        if (e.slow == 1) output += ' slow';
        if (e.subs_only == 1) output += ' subs-only';
        if (!e.lang && e.r9k != 1 && e.slow != 1 && e.subs_only != 1) {
            output += ' none.';
        }
        p.innerText = output;
        writeChat(p);
    });
    TAPIC.listen('message', function (e) {
        if(e.text == "!wins") {
            if(winMsg != undefined) {
                score = score || 0;
                tjs.say(displayName, winMsg.concat(score))
                .then(function(data) {
                  console.log(data);
                }).catch(function(err) {
                  console.log(err);
                });
            }    
        }
        const p = newP();
        const txt = parseText(e.emotes, e.text);
        var output = (e.mod ? '<img src="http://chat-badges.s3.amazonaws.com/mod.png">' : '') +
            (e.sub ? '<img src="' + TAPIC.getSubBadgeUrl() + '">' : '') +
            (e.turbo ? '<img src="http://chat-badges.s3.amazonaws.com/turbo.png">' : '') +
            (e.streamer ? '<img src="http://chat-badges.s3.amazonaws.com/broadcaster.png">' : '') +
            '<strong style="color: ' + e.color + ';">' +
            e.from +
            '</strong>' +
            (e.action ? '<span style="color: ' + e.color + ';">' : ':&nbsp;&nbsp;') + 
            txt +
            (e.action ? '</span>' : '');
        // e.emotes is the emotes, e.g. '25:0-4,12-16/1902:6-10'
        // https://github.com/justintv/Twitch-API/blob/master/IRC.md#privmsg
        // e.badges is an array of badges: https://discuss.dev.twitch.tv/t/beta-badge-api/6388
        p.innerHTML = output;
        writeChat(p);
    });
    TAPIC.listen('whisper', function (e) {
        const p = newP();
        var output = (e.turbo ? '<img src="http://chat-badges.s3.amazonaws.com/turbo.png">' : '') +
            '<strong style="color: ' + e.color + ';">' +
            e.from +
            '</strong>' +
            ' &gt; ' +
            '<strong>' + e.to + '</strong> : ' +
            e.text;
        // e.message_id & e.thread_id & e.user_id contain their respective ids
        // When using whispers for a bot, be sure to whitelist it: https://discuss.dev.twitch.tv/t/are-your-whispers-not-going-through-for-your-bot/5183/3
        p.innerHTML = output;
        writeChat(p);
    });
    TAPIC.listen('echoChat', function (e) {
        const p = newP();
        var output = '<strong style="color: ' + TAPIC.getColor() + ';">' + TAPIC.getDisplayName() +
            '</strong> : ' + e;
        p.innerHTML = output;
        writeChat(p);
    });
    TAPIC.listen('echoWhisper', function (e) {
        const p = newP();
        var output = '<strong style="color: ' + TAPIC.getColor() + ';">' + TAPIC.getDisplayName() +
            '</strong> &gt; <strong> ' + e.to + '</strong> : ' + e.text;
        p.innerHTML = output;
        writeChat(p);
    });
    TAPIC.listen('*', function(e) {
        console.log(e);
    });
            // TAPIC.listen('update', function () {
            //     console.info('TAPIC has updated its info from Twitch.');
            // });
};

// Utility functions
function tests() {
    // TAPIC.sendChat( 'Hello world!' );
    // TAPIC.sendWhisper( 'littlecatbot', 'Hello whisper!' );
    // TAPIC.changeChannel( 'letsmakefriends' );
    console.log('getUsername: ' + TAPIC.getUsername());
    console.log('getChannel: ' + TAPIC.getChannel());
    console.log('getGame: ' + TAPIC.getGame());
    console.log('getStatus: ' + TAPIC.getStatus());
    console.log('getFollowerCount: ' + TAPIC.getFollowerCount());
    console.log('getTotalViewCount: ' + TAPIC.getTotalViewCount());
    console.log('getCurrentViewCount: ' + TAPIC.getCurrentViewCount());
    console.log('getCreatedAt: ' + TAPIC.getCreatedAt());
    console.log('getLogo: ' + TAPIC.getLogo());
    console.log('getVideoBanner: ' + TAPIC.getVideoBanner());
    console.log('getProfileBanner: ' + TAPIC.getProfileBanner());
    var folUser = '71619374';
    var folTarget = '44230476';
    TAPIC.isFollowing(folUser, folTarget, function (res) {
        if (res.isFollowing) console.log('Following since: ' + res.dateFollowed);
        else console.log('Not following.');
    });
    // // Requires 'channel_check_subscription'
    // var subUser = '71619374';
    // TAPIC.isSubscribing( subUser, function( res ) {
    // 	if ( res.isSubscribing ) console.log( 'Subbed since: ' + res.dateSubscribed );
    // 	else console.log( 'Not a sub.' );
    // } );
    console.log('isPartner: ' + TAPIC.isPartner());
    console.log('getSubBadgeUrl: ' + TAPIC.getSubBadgeUrl());
    // TAPIC.runCommercial(30); // requires 'channel_commercial'
    console.log('isOnline: ' + TAPIC.isOnline());
    console.log('getFps: ' + TAPIC.getFps());
    console.log('getVideoHeight: ' + TAPIC.getVideoHeight());
    console.log('getDelay: ' + TAPIC.getDelay());
    console.log('getChatters: ' + JSON.stringify(TAPIC.getChatters()));
    // TAPIC.setStatusGame('Making a Twitch Javascript Framework #programming', 'Creative');
    // TAPIC.joinCommunity('catsonly');
    // TAPIC.leaveCommunity();
    console.log('getDisplayName: ' + TAPIC.getDisplayName());
    console.log('getColor: ' + TAPIC.getColor());
    console.log('getEmoteSets: ' + TAPIC.getEmoteSets());
    console.log('getMod: ' + TAPIC.getMod());
    console.log('getSub: ' + TAPIC.getSub());
    console.log('getTurbo: ' + TAPIC.getTurbo());
    console.log('getUserType: ' + TAPIC.getUserType());
    console.log('getPreview: ' + TAPIC.getPreview());
    console.log('getChannelID: ' + TAPIC.getChannelID());
    console.log('getUserID: ' + TAPIC.getUserID());
    console.log('getOauth: ' + TAPIC.getOauth());
    console.log('getClientID: ' + TAPIC.getClientID());
    console.log('getCommunityName: ' + TAPIC.getCommunityName());
    console.log('getCommunityDescription: ' + TAPIC.getCommunityDescription());
    console.log('getCommunityDescriptionHTML: ' + TAPIC.getCommunityDescriptionHTML());
    console.log('getCommunityRules: ' + TAPIC.getCommunityRules());
    console.log('getCommunityRulesHTML: ' + TAPIC.getCommunityRulesHTML());
    console.log('getCommunitySummary: ' + TAPIC.getCommunitySummary());
    console.log('getTeamName: ' + TAPIC.getTeamName());
    console.log('getTeamDisplayName: ' + TAPIC.getTeamDisplayName());
    TAPIC.findID('tokimonster', function (res) {
        console.log('findID: ' + res);
    });
    console.log('getTapicUptime: ' + TAPIC.getTapicUptime().hours + ':' + TAPIC.getTapicUptime().minutes + ':' + TAPIC.getTapicUptime().seconds)
    // TAPIC.kraken('games/top/', '&limit=100&offset=0', function (response) {...});
}

// This is for the webpage's chat, it doesn't have anything directly to do with TAPIC.js
function writeChat(elem) {
    const chatty = document.getElementById('chat');
    const nDiv = newLine();
    nDiv.appendChild(elem);
    chatty.insertBefore(nDiv, chatty.childNodes[0]);
    if (chatty.childElementCount > 21) {
        chatty.removeChild(chatty.lastChild);
    }
    // const chInfo = window.getComputedStyle(chatty, null);
    // const total = parseInt(chInfo.getPropertyValue('height')) + chatty.scrollTop + 18;
    // if(total >= chatty.scrollHeight || hasScrolled == false) {
    //     chatty.appendChild(nDiv);
    //     setTimeout(function(){ chatty.scrollTop = 1000000; }, 0.15);
    // } else {
    //     chatty.appendChild(nDiv);
    // }
};

function setStreamTitle(title) {
    if(myGameName == undefined) {
        TAPIC.setStatusGame(title, "");
    } else {
        TAPIC.setStatusGame(title, myGameName);
    }
};

function setGameTitle(title) {
    TAPIC.setStatusGame(myTitle, title);
};

function parseText(em, txt) {
    var r = 0;
    if (em != "") {
        var rtnStr = "";
        var emotes = new Array;
        // split emotes into every instance
        var ems = em.split('/');
        // iterate through each instance
        for(let emote of ems) {
            // split the code from the range
            let p = emote.indexOf(':');
            let c = emote.slice(0, p);
            let rs = emote.slice(p + 1, emote.length).split(',');
            rs.forEach(r => {
                let a = r.split('-');
                emotes.push({start: a[0], end: a[1], value: c});
            });
        }
        //iterate through the list to construct the final string
        emotes.forEach(m => {
            if(m.start > r) {
                rtnStr += txt.slice(r, m.start - 1) + "<img class='emotes' src='http://static-cdn.jtvnw.net/emoticons/v1/"+m.value+"/3.0'>";
                r = m.end + 1;
            } else {
                rtnStr += "<img class='emotes' src='http://static-cdn.jtvnw.net/emoticons/v1/"+m.value+"/3.0'>";
                r = m.end + 1;
            }
        });
        if (r >= txt.length) {
            return rtnStr;
        } else {
            return rtnStr += txt.slice(r, txt.length);
        }
    } else {
        return txt;
    }
};

function newImg(src, cls, id) {
    const nImg = document.createElement('img');
    nImg.src = src;
    if(cls) {
        nImg.className = cls;
    }
    if(id) {
        nImg.id = id;
    }
    return nImg;
};

function newLine(cls) {
    const nDiv = document.createElement('div');
    if(cls) {
        nDiv.className = cls;
    } else {
        nDiv.className = "chatEntry";
    }
    return nDiv;
};

function newP(cls, id) {
    const nP = document.createElement('p');
    if(cls) {
        nP.className = cls;
    }
    if(id) {
        nP.id = id;
    }
    return nP;
};