const { Datastore } = require('@google-cloud/datastore');

const config = require('../config');

const databaseConfig = {};
if(config.isDev) {
    databaseConfig.keyFile = config.gcpKeysFile;
}
const database = new Datastore(databaseConfig);

module.exports = database;