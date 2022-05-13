const { Storage } = require('@google-cloud/storage');

const config = require('../config');

const storageConfig = {};
// NOTE: altough keyFile is documented, unlike datastore, keyFilename is the one that works, fucked up shit
if(config.isDev) {
    storageConfig.keyFilename = config.gcpKeysFile;
}
const storage = new Storage(storageConfig);

const bucket = storage.bucket(config.gcpBucket);

function genFileKey() {
    return Math.random().toString().split('.')[1];
}

function getExt(filename) {
    const filenameParts = filename.split('.');
    return '.' + filenameParts[filenameParts.length - 1];
}

function objectKey(prefix, filename) {
    return prefix + genFileKey() + getExt(filename);
}

function publicUrl(name) {
    return `https://storage.googleapis.com/${config.gcpBucket}/${name}`;
}

/**
 * 
 * @param {string} prefix
 * @param {Express.Multer.File} file
 */
function upload(prefix, file) {
    const key = objectKey(prefix, file.originalname);
    const blob = bucket.file(key);
    const blobStream = blob.createWriteStream({
        contentType: file.mimetype
    });
    return new Promise((resolve, reject) => {
        blobStream.on('error', err => {
            reject(err);
        });
        blobStream.on('finish', () => {
            resolve(key);
        });
        // putting the execution here but it could be outside of the promise i guess right?
        blobStream.end(file.buffer);
    });
}

function remove(name) {
    return bucket.file(name).delete({
        ignoreNotFound: true
    });
}

function generateSignedWriteUrl(prefix, filename, contentType) {
    const key = objectKey(prefix, filename);
    return bucket
        .file(key)
        .getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + (15 * 60 * 1000),
            contentType
        }).then(res => [ key, res[0] ]);
}

module.exports = {
    publicUrl,
    upload,
    remove,
    generateSignedWriteUrl
};