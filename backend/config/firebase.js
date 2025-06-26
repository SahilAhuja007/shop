const admin = require("firebase-admin");

const seviceAccount = require("../firebaseKey.json");
admin.initializeApp({ credential: admin.credential.cert(seviceAccount) });

module.exports = admin;
