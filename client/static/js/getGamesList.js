var gameRqst = new XMLHttpRequest();
var gamesList;
gameRqst.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       console.log("super");
    }
};
gameRqst.open("GET", "192.168.1.28:8080", true);
gameRqst.send();