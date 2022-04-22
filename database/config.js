const path = require('path');

/**
 * @type {import('knex').Knex.Config}
 */
const knexConfig = {
    client: 'better-sqlite3',
    connection: {
        filename: path.dirname(__dirname) + '/at.bsqlite3'
    },
    migrations: {
        directory: path.join(__dirname, 'migrations'),
        stub: path.join(__dirname, 'migration-stubs', './base.stub')
    }
};

module.exports = knexConfig;