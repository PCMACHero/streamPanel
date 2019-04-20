// gives the user the ability to update their local ip from the application

function addUpListeners() {
    let updateBtn = document.getElementById('updateBtn');
    let updateInput = document.getElementById('input');
    updateBtn.addEventListener('click', async function() {
        console.log('click', updateInput.value)
        if (updateInput.value.length > 6) {
            //update the server
            let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'}, method: "POST", url: "/newIp", body: 'ip='.concat(updateInput.value)});
            let resFromDB = JSON.parse(response);
            if (resFromDB.message == "Success") {
                // reload the page
                location.reload();
            } else {
                // inform the user
                console.log(resFromDB);
            }
        } else {
            console.log('not long enough');
            //inform the user
        }
    });
};