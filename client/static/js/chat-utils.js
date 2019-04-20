var cDiv;
function setChat() {
    cDiv = document.getElementById('chatbox');
    const ex = document.getElementById('expandChat');
    const co = document.getElementById('contractChat');
    var style = window.getComputedStyle(cDiv);
    var gridRow = style.getPropertyValue('grid-row');

    // var height = "innerHeight" in window 
    //            ? window.innerHeight
    //            : document.documentElement.offsetHeight;

    // if(height > 560) {
    //     cDiv.style.gridRow = "1 / 7";
    // } else {
    //     cDiv.style.gridRow = "1 / 11";
    // }

    ex.addEventListener('click', function() {
        if(gridRow == "1 / 7") {
            gridRow = "1 / 8";
        } else if(gridRow == "1 / 8") {
            gridRow = "1 / 11";
        }
        cDiv.style.gridRow = gridRow;
    });
    co.addEventListener('click', function() {
        if(gridRow == "1 / 11") {
            gridRow = "1 / 8";
        } else if(gridRow == "1 / 8") {
            gridRow = "1 / 7";
        }
        cDiv.style.gridRow = gridRow;
    });
};

function chatScrolled() {
    if(hasScrolled == false) {
        hasScrolled = true;
    }
};

function clearRow() {
    cDiv.style.gridRow = '';
};