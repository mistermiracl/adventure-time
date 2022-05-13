const globalMiddleware = require('./global');
const adminMiddleware = require('./admin');
const multerMiddleware = require('./multer');

module.exports = {
    globalMiddleware,
    adminMiddleware,
    multerMiddleware
};