/**
 * @module MulterMiddleware
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const multer = require('multer');
const multerMemoryStorage = multer.memoryStorage();

const multerMiddelware = multer({
    storage: multerMemoryStorage
});

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
function mapFiles(req, res, next) {
    if(req.files && req.files.length) {
        /**
         * @type {{ [name: string]: number }}
         */
        const mappedFiles = req.files.reduce((o, f) => {
            o[f.fieldname] = f;
            return o;
        }, {});
        req.files = mappedFiles;
    }
    next();
}

module.exports = [ multerMiddelware.any(), mapFiles ];