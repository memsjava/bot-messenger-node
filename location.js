const { callSendMessage, callSendAPI } = require('./utils');
const axios = require('axios');
const https = require('https');

/*
start process orange
*/
async function sendOrangeAstuce(sender_psid) {
    let message = 'Payer aver orange money';
    message += '\nCode marchande: 218 084';
    message += '\n\nAppeler #144# puis 3 puis 2 puis entrer code marchande 218084';
    message += '\n\nPour continuer entrer votre numéro phone orange🤳';
    let request_body_text = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': message
        }
    };
    callSendMessage(request_body_text);
}

/*
start process telma
*/
async function sendTelmaAstuce(sender_psid) {
    let message = 'Payer aver mvola';
    message += '\nPayement mvola se fait par transfert vers le compte mvola au nom de Mr PATRICE, C.E.O de trano-vacance.mg';
    message += '\n\nNumero 034';
    message += '\n\nPour continuer entrer votre numéro phone telma🤳';
    let request_body_text = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': message
        }
    };
    callSendMessage(request_body_text);
}

/*
start process stripe
*/
async function sendStripeAstuce(sender_psid) {
    let message = 'Payement avec carte visa';
    message += '\nPour payer votre réservation avec Visa, on vous invite à naviguer directement sur le site web';
    message += '\n\nPour votre sécurité';
    message += '\n👉https://trano-vacance.mg';
    let request_body_text = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': message
        }
    };
    callSendMessage(request_body_text);
}
/*
send details to user
*/

async function sendDetails(sender_psid, id) {
    let response;
    let message = '';
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    // get data from our server
    const data = {
        id: id
    };
    try {
        const res = await axios.post(process.env.PAGE_DB + '/bot/v1/chat/detail/', data, { httpsAgent: agent });
        response = res.data;
        const _ = response.data;
        const filter = ['destination', 'name', 'cateogory', 'price', 'is_secured', 'wifi', 'can_cook', 'max_pers', 'air_con', 'nbr_beds', 'parking', 'piscine', 'eau_chaude']
        for (const [key, value] of Object.entries(_)) {
            if (value !== 'false' && filter.includes(key)) {
                message += `👉 ${key}: "${value}".\n`;
            }
        }

    } catch (error) {
        console.log(error)
    }

    let request_body = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": 'Informations détaillées',
                        "subtitle": message,
                        "image_url": "",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "RESERVER",
                                "payload": "BOOK_" + id
                            }
                        ],
                    }
                ]
            }
        }
    }
    let request_body_text = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': message
        }
    };
    callSendMessage(request_body_text);
    callSendAPI(sender_psid, request_body);
}

/*
send location to user
*/

async function sendDestination(sender_psid) {
    let listDest = [];
    let destButton = [];
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    // get data from our server
    const data = {
        sender_id: sender_psid,
    };
    try {
        const res = await axios.post(process.env.PAGE_DB + '/bot/v1/chat/destination/', data, { httpsAgent: agent });
        listDest = res.data;
        console.log(listDest)
    } catch (error) {
        console.log(error)
    }
    // if (listDest['data'].lenght > 0) {
    for (let i = 0; i < listDest['data'].length; i++) {
        let quickReply = {
            "content_type": "text",
            "title": listDest['data'][i],
            "payload": listDest['data'][i]
        };
        destButton.push(quickReply);
    }
    // }
    console.log(destButton)
    // Construct the message body
    let request_body = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': '✈️ Destination disponible dans notre système:',
            'quick_replies': destButton
        }
    };
    callSendMessage(request_body);
}

/*
send details to cnfirm to user
*/

async function sendBeforeConfirm(sender_psid, id) {
    let response;
    let message = '';
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    // get data from our server
    const data = {
        sender_id: sender_psid,
        id: id
    };
    try {
        const res = await axios.post(process.env.PAGE_DB + '/bot/v1/chat/book/confirm/', data, { httpsAgent: agent });
        response = res.data;
        const _ = response.data;
        const filter = ['destination', 'checkin', 'checkout', 'budget', 'nombres', 'total_amount']

        for (const [key, value] of Object.entries(_)) {
            if (value !== null && filter.includes(key)) {
                message += `🖌️ ${key}: "${value}".\n`;
            }
        }

    } catch (error) {
        console.log(error)
    }
    // Construct the message body
    let request_body = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": 'Information',
                        "subtitle": message,
                        "image_url": "",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CONFIRMER",
                                "payload": "CONFIRM_" + id
                            }
                        ],
                    }
                ]
            }
        }
    }
    let request_body_text = {
        'recipient': {
            'id': sender_psid
        },
        'message': {
            'text': message
        }
    };
    callSendMessage(request_body_text);
    callSendAPI(sender_psid, request_body);
}
/*
start process to confirm booking
*/

async function sendConfirmProcess(sender_psid, id) {
    let message = 'CONFIRM_PROCESS_' + id
    handleDefaultMessage(sender_psid, message)
}

// Handles messaging_postbacks events
async function handleDefaultMessage(sender_psid, message) {
    let response; //= { "text": `vetivety ah hitanao, vetivety aho tsitanao` };

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
            const res = await axios.post(process.env.PAGE_DB + '/bot/v1/chat/message/', data, { httpsAgent: agent });
            console.log(res.data);
            response = { "text": res.data['message'] };

            if (res.data['message'] === 'payement_method') {
                // Get the URL of the message attachment
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [
                                {
                                    "title": "Mode de paiement",
                                    "subtitle": "",
                                    "image_url": "https://tse4.mm.bing.net/th?id=OIP.q7-3TqRBDMC4dakJumIAQQHaFu",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "ORANGE",
                                            "payload": "PAY_ORANGE_MONEY",
                                        },
                                        {
                                            "type": "postback",
                                            "title": "TELMA",
                                            "payload": "PAY_MVOLA",
                                        },
                                        {
                                            "type": "postback",
                                            "title": "CARD VISA",
                                            "payload": "PAY_STRIPE",
                                        }
                                    ],
                                }
                            ]
                        }
                    }
                }
            }

            if (res.data['message'] === 'get_result') {
                // Get the URL of the message attachment
                let data = res.data['data'];
                let elements = [];
                for (let i = 0; i < data.length; i++) {
                    let element = {
                        "title": data[i]['name'] + ' ' + data[i]['price'] + '/ jr',
                        "subtitle": data[i]['extra'],
                        "image_url": data[i]['images'],
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Détails",
                                "payload": "DETAILS_" + data[i]['id'],
                            },
                            {
                                "type": "postback",
                                "title": "Reserver",
                                "payload": "BOOK_" + data[i]['id'],
                            }
                        ],
                    };
                    elements.push(element);
                }
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": elements
                        }
                    }
                }

            }
            console.log(response);
        } catch (error) {
            response = {
                "text": `You sent the message: "${message}". Send again, we got some trouble!`
            }
        }
    }
    // Sends the response message
    callSendAPI(sender_psid, response);
}


module.exports = {
    sendStripeAstuce,
    sendTelmaAstuce,
    sendOrangeAstuce,
    sendDetails,
    sendDestination,
    sendBeforeConfirm,
    sendConfirmProcess,
    handleDefaultMessage

};
