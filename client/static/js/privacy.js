var box = document.getElementById('checkbox');
var check = document.getElementById('check');
var cont = document.getElementById('acceptBtn');
var err = document.getElementById('error');
check.style.color = "transparent";
check.style.display = "inline-block";
function checkClicked() {
    box.addEventListener('click', function() {
        if (check.style.color == "transparent") {
            err.innerText = "";
            check.style.color = "#ff604a";
            check.style.fontSize = "13";
        } else {
            check.style.color = "transparent";
        }
    });
};
function addContinueListener() {
    cont.addEventListener('click', function() {
        // Check if privacy policy is clicked
        if (check.style.color != "transparent") {
            let f = document.createElement('form');
            f.method = "POST";
            f.action = "/privacy-accepted";
            let i = document.createElement('input');
            i.type = 'hidden';
            i.name = 'accepted';
            i.value = 'true';
            f.appendChild(i);
            err.appendChild(f);
            f.submit();
        } else {
            err.innerText = "You must click to accept the privacy policy before proceeding."
        }
    });
}
checkClicked();
addContinueListener();