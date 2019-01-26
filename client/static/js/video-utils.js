function setVideo() {
  var embed = new Twitch.Embed("stream", {
    channel: displayName,
    layout: "video",
    playsinline: true,
    allow: false,
    height: "100%",
    width: "100%"
  });

  embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    var player = embed.getPlayer();
    player.pause();
  });
  setExpandBtn();
};

function resetVideo() {
  embed = undefined;
  document.getElementById('stream').innerHTML = "";
  setVideo();
};

function setExpandBtn() {
  const btn = document.getElementById('exStream');
  var iTag = document.getElementById('exI');
  btn.onclick = function() {
    // find what gRow and col they have 
    var vid = document.getElementById('vid');
    var stream = document.getElementById('stream');
    var info = document.getElementById('info');
    var vidStyle = window.getComputedStyle(vid);
    var innerStyle = window.getComputedStyle(stream);
    var gRow = vidStyle.getPropertyValue('grid-row');
    var gCol = vidStyle.getPropertyValue('grid-column');
    var w = innerStyle.getPropertyValue('width');

    // Set vid on grid
    if (gRow == "8 / 11") {
      gRow = "7 / 11";
      vid.style.gridRow = gRow;
      // Set width of stream
      stream.style.width = "70vmin";
      iTag.innerText = "expand_more";
      // Hide info
      info.style.display = "none";
    } else {
      gRow = "8 / 11";
      vid.style.gridRow = gRow;
      stream.style.width = "53vmin";
      iTag.innerText = "expand_less";
      info.style.display = "grid";
    }
  };
};