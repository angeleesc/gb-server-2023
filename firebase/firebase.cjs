const admin = require("firebase-admin");
const serviceAccountGB = require("./keygb.json");
const serviceAccountLV = require("./keylv.json");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// const { auth } = admin;

const gbApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountGB),
  },
  "gb"
);

const lvApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountLV),
  },
  "lv"
);

const db = gbApp.firestore();
const auth = gbApp.auth();
const gbAuth = gbApp.auth()



const dbGB = gbApp.firestore();
const dbLV = lvApp.firestore();

module.exports = { db, auth, dbGB, dbLV, gbAuth };
