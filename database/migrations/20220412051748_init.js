const { Knex } = require("knex");

/**
 * Executes the migration
 * @param {Knex} database 
 */
exports.up = function({ schema }) {
    return schema.createTable('season', table => {
        table.increments();
        table.integer('number').notNullable().unique();
        table.string('name').unique();
        table.string('slug').notNullable().unique();
        table.text('description');
    }).createTable('chapter', table => {
        table.increments();
        table.integer('number').notNullable().unique();
        table.string('name').notNullable().unique();
        table.string('slug').notNullable().unique();
        table.string('description');
        table.integer('season_id').notNullable();
        table.foreign('season_id').references('id').inTable('season');
    }).createTable('rotating_image_pair', table => {
        table.increments();
        table.text('left').notNullable();
        table.text('right').notNullable();
    });
};

/**
 * Rolls back the migration
 * @param {Knex} database asdasd
 */
exports.down = function({ schema }) {
    return schema
        .dropTable('season')
        .dropTable('chapter')
        .dropTable('rotating_image_pair');
};