/**
 * @module SeasonModel
 */

const database = require('./database');

const kind = 'season';

function createKey(id) {
    if(id) {
        return database.key([kind, parseInt(id)]);//have to parse it to int, for it return 'id' instead of 'name'
    }
    return database.key(kind);
}

function createEntity(data, id) {
    return {
        key: createKey(id),
        data
    }
}

function all() {
    return database.createQuery(kind).order('number').run()
        .then(res => res[0])
        .then(entities => entities.map(e => {
            e.id = e[database.KEY].id;
            return e;
        }));
}

async function allActive() {
    // dynamic import because of circular dependencies, i hate it, the question is hould models call and reference each other at all? ive been working like that for quite a while
    const chapterModel = require('./chapter');

    return database.createQuery(kind).order('number').run()
        .then(res => res[0])
        .then(async entities => await entities.reduce(async (acc, e) => {
            acc = await acc;
            e.id = e[database.KEY].id;
            if(await chapterModel.anyBySeason(e.id)) {
                acc.push(e);
            }
            return acc;
        }, Promise.resolve([])));
}


function allWhere(conditions) {
    const q = database.createQuery(kind);
    for(const k in conditions) {
        q.filter(k, conditions[k]);
    }
    return q
        .order('number')
        .run()
        .then(res => res[0])
        .then(entities => entities.map(e => {
            e.id = e[database.KEY].id;
            return e;
        }));
}

function find(id) {
    return database.get(createKey(id))
        .then(res => res.length ? res[0] : null)
        .then(entity => {
            entity.id = entity[database.KEY].id;
            return entity;
        });
}

function findByNumber(number) {
    return database.createQuery(kind)
        .filter('number', number)
        .run()
        .then(res => res.length ? res[0] : null)
        .then(entities => entities?.length ? entities[0] : null)
        .then(entity => {
            entity.id = entity[database.KEY].id;
            return entity;
        });
}

function insert(season) {
    if(!season.slug) {
        if(season.special) {
            season.slug = season.name.toLowerCase().replace(/\s/g, '-');
        } else {
            season.slug = 'season-' + season.number;
        }
    }
    if(season.number) {
        season.number = parseInt(season.number);
    } else {
        // NOTE: using an empty string put numberless seasons in the bottom of the ascending order
        season.number = '';
    }
    return database.insert(createEntity(season));
}

function update(id, season) {
    delete season.id; // cant update the id
    if(season.number) {
        season.number = parseInt(season.number);
    } else {
        season.number = '';
    }
    return database.update(createEntity(season, id));
}

function remove(id) {
    return database.delete(createKey(id));
}

module.exports = {
    createKey,
    all,
    allActive,
    find,
    insert,
    update,
    remove,
    allWhere,
    findByNumber
}