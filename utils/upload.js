require('dotenv').config({path :'../.env'})
const admin = require('firebase-admin');
const { firebase } = require('../firebase');
admin.initializeApp({
    credential: admin.credential.cert(firebase),
    storageBucket: process.env.BUCKET_URL
});

function Upload(pathtoimage, filename) {
    return new Promise(async (resolve, reject) => {
        try {
            const bucket = admin.storage().bucket();
            const options = {
                destination: `images/${filename}`,
            };
            const response = await bucket.upload(pathtoimage, options)
            const { id } = response[0];

            resolve({ success: true, src: `https://firebasestorage.googleapis.com/v0/b/sotrage-6529b.appspot.com/o/${id}?alt=media` })
        } catch (error) {
            reject({ success: true, error: error.message })
        }
    })
}

module.exports = Upload;