const { callSendMessage, callSendAPI } = require('./utils');
const axios = require('axios');
const https = require('https');
/*
send compte menu to user
*/

async function sendCompte(sender_psid) {
    // Construct the message body
    let request_body = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': "Votre compte sur la plateforme de reservation trano-vacance.mg.",
            'quick_replies': [
                {
                    'content_type': 'text',
                    'title': 'Details compte',
                    'payload': 'DETAILS_COMPTE'
                },
                {
                    'content_type': 'text',
                    'title': 'Votre transactions',
                    'payload': 'YOUR_TRANSACTIONS'
                },
                {
                    'content_type': 'text',
                    'title': 'Votre reservations',
                    'payload': 'YOUR_BOOKING'
                }
            ]
        }
    };

    callSendMessage(request_body);
}
// Handle default events
async function handleDefaultAccountMessage(sender_psid, message) {
    let response; //= { "text": `vetivety ah hitanao, vetivety aho tsitanao` };
    let second_message = false;
    let request_body;
    const data = {
        sender_id: sender_psid,
        message: message,
    };

    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    // Checks if the message contains text
    if (message) {
        try {
            const res = await axios.post(process.env.PAGE_DB + '/bot/v1/chat/compte/', data, { httpsAgent: agent });
            console.log(res.data);
            response = { "text": res.data['message'] };
            if (message.toUpperCase() === "DETAILS COMPTE") {
                if (res.data['message'] === 'details_compte') {
                    let res_message = '';
                    const _ = res.data['data'];
                    const filter = ['mobile_money', 'profile_id', 'nom', 'phone_number']
                    for (const [key, value] of Object.entries(_)) {
                        if (value !== null && filter.includes(key)) {
                            res_message += `👉 ${key}: "${value}".\n`;
                        }
                    }
                    response = { "text": res_message };
                }
                else {
                    second_message = true
                    request_body = {
                        'recipient': {
                            'id': sender_psid
                        },
                        'message': {
                            'text': res.data['message'] + "\n\nQu'est ce vous voulez faire maintenant.",
                            'quick_replies': [
                                {
                                    'content_type': 'text',
                                    'title': 'Cherche maison',
                                    'payload': 'FIND_LOCATION_PAYLOAD'
                                },
                                {
                                    'content_type': 'text',
                                    'title': 'Cree compte',
                                    'payload': 'CREATE_ACCOUNT'
                                },

                            ]
                        }
                    };

                }
            }

        } catch (error) {
            response = {
                "text": `You sent the message: "${message}". Send again, we got some trouble!`
            }
        }
    }
    // Sends the response message
    if (!second_message)
        callSendAPI(sender_psid, response);
    if (second_message)
        callSendMessage(request_body);
}


module.exports = {
    sendCompte,
    handleDefaultAccountMessage
};
