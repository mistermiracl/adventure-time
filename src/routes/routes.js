const IndexController = require('../controllers/index-controller');
const SeasonController = require('../controllers/seasons-controller');
const AdminController = require('../controllers/admin-controller');

const router = require('express').Router();

/**
 * 
 * @param {import('express').Express} app 
 */
module.exports = app => {
    
    router.get('/admin', AdminController.index);
    router.get('/admin/login', AdminController.login);
    router.post('/admin/login', AdminController.login);
    router.get('/admin/seasons', AdminController.seasons);
    router.get('/admin/season/:id?', AdminController.season);
    router.post('/admin/season/:id?', AdminController.season);
    router.get('/admin/season/:id/delete', AdminController.deleteSeason);
    router.get('/admin/images', AdminController.images);
    router.get('/admin/image/:id?', AdminController.image);
    router.post('/admin/image/:id?', AdminController.image);

    router.get('/', IndexController.index);

    router.get('/seasons/:slug?', SeasonController.index);
    router.get('/seasons/:seasonSlug/:chapterSlug', SeasonController.chapter);

    return router;
};