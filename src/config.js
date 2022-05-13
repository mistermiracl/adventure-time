const path = require('path');

require('dotenv').config();

const config = Object.freeze((function() {
    var config = {
        port: process.env.PORT,
    
        projectRoot: path.dirname(__dirname),
        isDev: process.env.NODE_ENV === 'development',
        isProd: process.env.NODE_ENV === 'production',
        isLocal: process.env.LOCAL === 'true',
    
        gcpKeysFile: process.env.GCP_KEYS_FILE,
        gcpBucket: process.env.GCP_BUCKET,

        appSecret: process.env.APP_SECRET
    };

    config.gcpKeysFile = config.gcpKeysFile ? path.join(config.projectRoot, config.gcpKeysFile) : null;

    return config;
})());

module.exports = config;