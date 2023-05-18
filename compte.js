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
            'text': "Information sur votre compte sur la plateforme de reservation trano-vacance.mg.",
            'quick_replies': [
                {
                    'content_type': 'text',
                    'title': 'Details compte',
                    'payload': 'DETAILS_COMPTE'
                },
                {
                    'content_type': 'text',
                    'title': 'Details reservations',
                    'payload': 'DETAILS_RESERVATIONS'
                },
                {
                    'content_type': 'text',
                    'title': 'Details transactions',
                    'payload': 'DETAILS_TRANSACTIONS'
                },
            ]
        }
    };

    callSendMessage(request_body);
}
// Handle default events
async function handleDefaultAccountMessage(sender_psid, message) {
    let response; //= { "text": `vetivety ah hitanao, vetivety aho tsitanao` };
    let second_message = false;
    let first_message = false;
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
                    first_message = true
                    second_message = true
                    request_body = {
                        'recipient': {
                            'id': sender_psid
                        },
                        'message': {
                            'text': "\n\nQu'est ce vous voulez faire maintenant.",
                            'quick_replies': [
                                {
                                    'content_type': 'text',
                                    'title': 'Cherche maison',
                                    'payload': 'FIND_LOCATION_PAYLOAD'
                                },
                                {
                                    'content_type': 'text',
                                    'title': 'Update compte',
                                    'payload': 'UPDATE_COMPTE'
                                },
                            ]
                        }
                    };
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
            if (message.toUpperCase() === "DETAILS TRANSACTIONS") {
                if (res.data['message'] === 'details_transactions') {
                    let res_message = '';
                    const _ = res.data['data'];
                    const filter = ['amount', 'motifs', 'transaction_type']
                    for (const [key, value] of Object.entries(_)) {
                        for (const [key_, value_] of Object.entries(value)) {
                            if (value_ !== null && filter.includes(key_)) {
                                res_message += `👉 ${key_}: "${value_}".\n`;
                            }
                        }
                        res_message += `\n`;
                    }
                    response = { "text": res_message };
                    first_message = true
                    second_message = true
                    request_body = {
                        'recipient': {
                            'id': sender_psid
                        },
                        'message': {
                            'text': "\n\nQu'est ce vous voulez faire maintenant.",
                            'quick_replies': [
                                {
                                    'content_type': 'text',
                                    'title': 'Cherche maison',
                                    'payload': 'FIND_LOCATION_PAYLOAD'
                                },
                                {
                                    'content_type': 'text',
                                    'title': 'Details reservations',
                                    'payload': 'DETAILS_RESERVATIONS'
                                }
                            ]
                        }
                    };
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
                                    'title': 'Details reservations',
                                    'payload': 'DETAILS_RESERVATIONS'
                                },

                            ]
                        }
                    };

                }
            }
            if (message.toUpperCase() === "DETAILS RESERVATIONS") {
                if (res.data['message'] === 'details_reservations') {
                    let res_message = '';
                    const _ = res.data['data'];
                    // const filter = ['mobile_money', 'profile_id', 'nom', 'phone_number']
                    for (const [key, value] of Object.entries(_)) {
                        // if (value !== null && filter.includes(key)) {
                        if (value !== null) {
                            res_message += `👉 ${key}: "${value}".\n`;
                        }
                    }
                    response = { "text": res_message };
                    first_message = true
                    second_message = true
                    request_body = {
                        'recipient': {
                            'id': sender_psid
                        },
                        'message': {
                            'text': "\n\nQu'est ce vous voulez faire maintenant.",
                            'quick_replies': [
                                {
                                    'content_type': 'text',
                                    'title': 'Cherche maison',
                                    'payload': 'FIND_LOCATION_PAYLOAD'
                                },
                                {
                                    'content_type': 'text',
                                    'title': 'Details transactions',
                                    'payload': 'DETAILS_TRANSACTIONS'
                                }
                            ]
                        }
                    };
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
                                    'title': 'Details transactions',
                                    'payload': 'DETAILS_TRANSACTIONS'
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
    if (first_message && !second_message)
        await callSendAPI(sender_psid, response);
    if (!first_message && second_message)
        await callSendMessage(request_body);
    if (first_message && second_message)
        await callSendAPI(sender_psid, response).then(async () => {
            setTimeout(() => {
                callSendMessage(request_body);
            }, 2000);
        })
}

async function handleNotif(message) {
    const data = {
        message: message,
    };
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    await axios.post(process.env.PAGE_DB + '/zaho/v1/denotification/', data, { httpsAgent: agent });
}

//UPDATE MENU
async function handleUpdate(sender_psid) {
    // Construct the message body
    let request_body = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': "Faire modification sur les info de votre compte:",
            'quick_replies': [
                {
                    'content_type': 'text',
                    'title': 'Update name',
                    'payload': 'UPDATE_NAME'
                },
                {
                    'content_type': 'text',
                    'title': 'Update email',
                    'payload': 'UPDATE_EMAIL'
                },
                {
                    'content_type': 'text',
                    'title': 'Update phone',
                    'payload': 'UPDATE_PHONE'
                },
            ]
        }
    };

    callSendMessage(request_body);
}
async function handleUpdateData(sender_psid, message) {
    let response;
    // update chatstatus to wait for modif
    if (message.toUpperCase() === "UPDATE NAME")
        response = {
            "text": `Veuillez entrer votre nouvelle Nom`
        }
    if (message.toUpperCase() === "UPDATE EMAIL")
        response = {
            "text": `Veuillez entrer la nouvelle email addresse`
        }
    if (message.toUpperCase() === "UPDATE PHONE")
        response = {
            "text": `Veuillez entrer votre nouvelle numero telephone`
        }
    await callSendAPI(sender_psid, response);
}

module.exports = {
    sendCompte,
    handleNotif,
    handleUpdate,
    handleUpdateData,
    handleDefaultAccountMessage
};
