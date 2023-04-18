/*
fonction to send data back to messenger
*/
const request = require('request');


async function callSendMessage(request_body) {
    // Send the HTTP request to the Messenger Platform
    request({
        'uri': 'https://graph.facebook.com/v13.0/me/messages',
        'qs': {
            'access_token': process.env.PAGE_ACCESS_TOKEN
        },
        'method': 'POST',
        'json': request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Welcome message sent!');
        } else {
            console.error('Unable to send welcome message:', err);
        }
    });
}
async function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {
    callSendMessage,
    callSendAPI,
};
