/**
 * @type {knex.knex}
 */
const knex = require('knex');

// TODO: move it to src/index.js
const config = require('../../database/config');

module.exports = knex(config);