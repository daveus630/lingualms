const admin = require("firebase-admin");
const serviceAccount = require("../keyfile.json");

//initialize firebase admin sdk
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//initialize an instance of of cloud firestore
const database = admin.firestore();
database.settings({ timestampsInSnapshots: true });

module.exports = database;
