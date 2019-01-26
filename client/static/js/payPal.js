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

paypal.Button.render({
    env: 'sandbox',

    client: {
        // sandbox:    'AcmTbrd0M4j-WRoUQv_woKcWBxXWhcK7Zl5KDyVImq9BGYGhgITbX_y_O-UKKus-KCQjkolIxN6NTRMy',
        sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
        production: 'AYdgfJy78QboAv0LkOURaerw28HZLaWS0wJURdblQGGKt0ahtJCzhy-oh-AvL4lBpI0FvDf-8VSqqya1'
    },

    commit: true,

    style: {
        color: 'gold',
        size: 'medium'
    },

    payment: function(data, actions) {

        // Make a call to the REST api to create the payment
        return actions.payment.create({
            payment: {
                // name: "Stream Daddy for Twitch",
                transactions: [
                    {
                        amount: { total: '5.00', currency: 'USD' }
                    }
                ]
            }
        });
    },

    // onAuthorize() is called when the buyer approves the payment
    onAuthorize: function(data, actions) {

        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then(async function(res) {
            console.log("payment went through", res);
            if(res) {
                if(res.state == "approved"){
                    let referralCode = document.getElementById('input').value;
                    // let formData = new FormData();
                    // formData.append("referralCode", referralCode);
                    // console.log(formData);
                    let response = await request({headers: {'Content-type':'application/x-www-form-urlencoded'},method: "POST", url: "http://localhost:8000/paypal-accepted/".concat(res.id), body: 'referralCode='.concat(referralCode)});
                    let resFromDB = JSON.parse(response);
                    if (resFromDB.message == "Success") {
                        console.log("added to db", resFromDB);
                        // redirect to success page
                        window.location = "http://localhost:8000/success";
                    }
                }
            }
        });
    },

    onCancel: function(data, actions) {
        return
      },

    onError: function(err) {
        console.log(err);

        // Tell user of the error
    }
}, '#paypal-button');

// paypal.Button.render({

//     env: 'sandbox', // sandbox | production

//     // PayPal Client IDs - replace with your own
//     // Create a PayPal app: https://developer.paypal.com/developer/applications/create
//     client: {
//         sandbox:    'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
//         production: '<insert production client id>'
//     },

//     // Show the buyer a 'Pay Now' button in the checkout flow
//     commit: true,

//     // payment() is called when the button is clicked
//     payment: function(data, actions) {

//         // Make a call to the REST api to create the payment
//         return actions.payment.create({
//             payment: {
//                 transactions: [
//                     {
//                         amount: { total: '0.01', currency: 'USD' }
//                     }
//                 ]
//             }
//         });
//     },

//     // onAuthorize() is called when the buyer approves the payment
//     onAuthorize: function(data, actions) {

//         // Make a call to the REST api to execute the payment
//         return actions.payment.execute().then(function() {
//             window.alert('Payment Complete!');
//         });
//     }

// }, '#paypal-button');