'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
Error.stackTraceLimit = Infinity;

import * as paro from './paro';
import * as comments from './comments';
module.exports = {
    ...paro,
    ...comments,
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

