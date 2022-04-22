/**
 * @module AdminController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const database = require('./database');

const tableName = 'season';

function all() {
    return database.select().from(tableName).orderBy('number');
}

function find(id) {
    return database.select().from(tableName).where('id', id).first();
}

function insert(season) {
    if(!season.slug) {
        season.slug = 'season-' + season.number;
    }
    return database.insert(season).into(tableName);
}

function update(id, season) {
    delete season.id; // cant update the id
    return database(tableName).update(season).where('id', id);// .table(tableName)
}

function remove(id) {
    return database(tableName).del().where('id', id);
}

module.exports = {
    all,
    find,
    insert,
    update,
    remove
}