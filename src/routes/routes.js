const router = require('express').Router();

const { adminMiddleware, multerMiddleware } = require('../middleware');

const IndexController = require('../controllers/index-controller');
const SeasonController = require('../controllers/seasons-controller');
const AdminController = require('../controllers/admin-controller');

/**
 * 
 * @param {import('express').Express} app 
 */
module.exports = app => {
    
    // index
    router.get('/', IndexController.index);

    // seasons
    router.get('/seasons/:slug?', SeasonController.index);
    router.get('/seasons/:seasonSlug/:chapterSlug', SeasonController.chapter);

    // admin
    router.get('/admin/login', AdminController.login);
    router.post('/admin/login', AdminController.login);
    router.use(adminMiddleware);
    router.get('/admin', AdminController.index);
    router.get('/admin/seasons', AdminController.seasons);
    router.get('/admin/season/:id?', AdminController.season);
    router.post('/admin/season/:id?', AdminController.season);
    router.get('/admin/season/:id/delete', AdminController.deleteSeason);
    router.get('/admin/chapters', AdminController.chapters);
    router.get('/admin/chapter/:id?', AdminController.chapter);
    router.post('/admin/chapter/upload-url', AdminController.chapterUpload);
    // NOTE: just like in fast api param urls must be declared later
    router.post('/admin/chapter/:id?', multerMiddleware, AdminController.chapter);
    router.get('/admin/chapter/:id/delete', AdminController.deleteChapter);
    router.delete('/admin/chapter/:id/source', AdminController.deleteChapterSource);
    router.get('/admin/images', AdminController.images);
    router.get('/admin/image/:id?', AdminController.image);
    router.post('/admin/image/:id?', AdminController.image);

    return router;
};