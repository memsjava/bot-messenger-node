/*
 * Starter Project for Messenger Platform Quick Start Tutorial
 *
 * Remix this as the starting point for following the Messenger Platform
 * quick start tutorial.
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 */

'use strict';
// Imports dependencies and set up http server

const express = require('express');
const bodyParser = require('body-parser');

const {
  sendCompte,
  resaCompte,
  handleDefaultAccountMessage
} = require('./compte');
const { callSendMessage, callSendAPI } = require('./utils');
const {
  sendStripeAstuce,
  sendTelmaAstuce,
  sendOrangeAstuce,
  sendDetails,
  sendDestination,
  sendBeforeConfirm,
  sendConfirmProcess,
  handleDefaultMessage
} = require('./location');

const app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      if (sender_psid !== process.env.PAGE_FB_ID) {
        if (webhook_event.message) {
          console.log("message le")
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          console.log("postback le")
          handlePostback(sender_psid, webhook_event.postback);
        }
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  }
  else if (body.object === 'notification') {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      callSendAPI(sender_psid, webhook_event.message);
    })
    res.status(200).send('EVENT_RECEIVED');
  }
  else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Handles messages events
async function handleMessage(sender_psid, received_message) {

  let hafatra = received_message.text

  if (hafatra.toUpperCase() === "ALEFA") {
    sendWelcomeMessage(sender_psid);
  }
  else if (hafatra.toUpperCase() === "CHERCHE MAISON") {
    sendDestination(sender_psid);
  }
  else if (hafatra.toUpperCase() === "VOTRE COMPTE") {
    sendCompte(sender_psid);
  }
  else if (hafatra.toUpperCase() === "DETAILS RESERVATIONS") {
    handleDefaultAccountMessage(sender_psid, hafatra)
  }
  else if (hafatra.toUpperCase() === "DETAILS TRANSACTIONS") {
    handleDefaultAccountMessage(sender_psid, hafatra)
  }
  else if (hafatra.toUpperCase() === "DETAILS COMPTE") {
    handleDefaultAccountMessage(sender_psid, hafatra);
  }
  else if (hafatra.toUpperCase().includes('BOOK_')) {
    const id = payload.split('BOOK_')[1]
    sendBeforeConfirm(sender_psid, id);
  }
  else {
    handleDefaultMessage(sender_psid, hafatra)
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  // Get the payload for the postback
  let payload = received_postback.payload;
  if (payload === 'GET_STARTED_PAYLOAD') {
    sendWelcomeMessage(sender_psid);
  }
  else if (payload === 'FIND_LOCATION_PAYLOAD') {
    sendDestination(sender_psid);
  }
  else if (payload === 'PAY_ORANGE_MONEY') {
    sendOrangeAstuce(sender_psid);
  }
  else if (payload === 'PAY_MVOLA') {
    sendTelmaAstuce(sender_psid);
  }
  else if (payload === 'PAY_STRIPE') {
    sendStripeAstuce(sender_psid);
  }
  else if (payload.includes('DETAILS_')) {
    const id = payload.split('DETAILS_')[1]
    sendDetails(sender_psid, id);
  }
  else if (payload.includes('BOOK_')) {
    const id = payload.split('BOOK_')[1]
    sendBeforeConfirm(sender_psid, id);
  }
  else if (payload.includes('CONFIRM_')) {
    const id = payload.split('CONFIRM_')[1]
    sendConfirmProcess(sender_psid, id);
  }
  else {
    console.log('Unhandled postback received: ' + payload);
  }
}

/*
welcome message
*/

function sendWelcomeMessage(sender_psid) {
  // Construct the message body
  let request_body = {
    'recipient': {
      'id': sender_psid
    },
    'message': {
      'text': "Bienvenue!! \n\nComment pouvons-nous vous aider aujourd'hui ?",
      'quick_replies': [
        {
          'content_type': 'text',
          'title': 'Cherche maison',
          'payload': 'FIND_LOCATION_PAYLOAD'
        },
        {
          'content_type': 'text',
          'title': 'Faire reservation',
          'payload': 'BOOK_NOW_PAYLOAD'
        },
        {
          'content_type': 'text',
          'title': 'Votre compte',
          'payload': 'ACCOUNT_PAYLOAD'
        }
      ]
    }
  };

  callSendMessage(request_body);
}
