require('dotenv').config({ path: '../.env' })
const admin = require('firebase-admin');
const { firebase } = require('../firebase');

admin.initializeApp({
    credential: admin.credential.cert(firebase),
    storageBucket: process.env.BUCKET_URL
});
function Upload(buffer, filename) {
    return new Promise(async (resolve, reject) => {
        try {
            const bucket = admin.storage().bucket();
            const file = bucket.file(`images/${filename}`);

            const stream = file.createWriteStream({
                metadata: {
                    contentType: 'image/png',
                },
            });

            stream.on('finish', () => {
                resolve({
                    success: true,
                    src: `https://firebasestorage.googleapis.com/v0/b/sotrage-6529b.appspot.com/o/images%2F${filename}?alt=media`,
                });
            });

            stream.on('error', (error) => {
                reject({
                    success: false,
                    error: error.message,
                });
            });

            stream.end(buffer);
        } catch (error) {
            reject({
                success: false,
                error: error.message,
            });
        }
    });
}


module.exports = Upload;