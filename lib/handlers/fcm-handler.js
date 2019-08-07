let admin = require('firebase-admin');
let serviceAccount = require("./../../configs/cardkart-6eea5-firebase-adminsdk-we13l-4ffe93a522.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


async function  sendMessage(message) {
    try {
        return await admin.messaging().send(message);
    }
    catch(ex){
        throw ex;
    }
}

module.exports = {
    sendMessage
}