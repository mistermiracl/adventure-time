const IndexController = require('../controllers/index-controller');
const SeasonController = require('../controllers/season-controller');
const ChapterController = require('../controllers/chapter-controller');

const router = require('express').Router();

/**
 * 
 * @param {import('express').Express} app 
 */
module.exports = app => {
    
    router.get('/', IndexController.index);
    router.get('/season', SeasonController.index);
    router.get('/chapter', ChapterController.index);

    return router;
};