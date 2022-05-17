/**
 * @module ChapterModel
 */

const database = require('./database');
const season = require('./season');

const kind = 'chapter';

function createKey({ id, seasonId }) {
    var key;
    if (id) {
        key = database.key([kind, parseInt(id)]);//have to parse it to int, for it return 'id' instead of 'name'
    } else {
        key = database.key(kind);
    }
    if(seasonId) {
        key.parent = season.createKey(seasonId);
    }
    return key;
}

function createEntity({ id, chapter, seasonId, key }) {
    return {
        key: key ? key : createKey({ id, seasonId }),
        data: chapter
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

function allBySeason(seasonId) {
    return database.createQuery(kind)
        .hasAncestor(season.createKey(seasonId))
        .order('number')
        .run()
        .then(res => res[0])
        .then(entities => entities.map(e => {
            e.id = e[database.KEY].id;
            return e;
        }));
}

function find(id, seasonId) {
    return database.get(createKey({ id, seasonId }))
        .then(res => res.length ? res[0] : null)
        .then(entity => {
            entity.id = entity[database.KEY].id;
            return entity;
        });
}

function findBySlug(slug) {
    return database.createQuery(kind)
        .filter('slug', slug)
        .run()
        .then(res => res.length && res[0].length ? res[0][0] : null)
        .then(entity => {
            entity.id = entity[database.KEY].id;
            return entity;
        });
}

function anyBySeason(seasonId) {
    return database.createQuery(kind)
        .hasAncestor(season.createKey(seasonId))
        .limit(1)
        .run()
        .then(res => res[0].length && res[0][0]);
}

function insert(chapter, seasonId) {
    if (!chapter.slug) {
        chapter.slug = `chapter-${chapter.number}-${chapter.name.toLowerCase().replace(/\s/g, '-')}`;
    }
    chapter.number = parseInt(chapter.number);
    chapter = createEntity({ chapter, seasonId });
    return database.insert(chapter).then(() => chapter.key.id);
}

// NOTE: datastore does not allow updating some attributes like dynamo or mongo, so we have to retrieve modify then send
function update(chapter) {
    const key = chapter[database.KEY];
    delete chapter.id; // cant update the id
    delete chapter[database.KEY];
    chapter.number = parseInt(chapter.number);
    return database.update(createEntity({ key, chapter }));
}

function remove(id, seasonId) {
    return database.delete(createKey({ id, seasonId }));
}

module.exports = {
    all,
    allBySeason,
    find,
    findBySlug,
    anyBySeason,
    insert,
    update,
    remove
}