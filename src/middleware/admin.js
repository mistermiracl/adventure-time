/**
 * @module AdminMiddleware
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const status = require('http2').constants;

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
    if(!req.session.authenticated){
        return res.sendStatus(status.HTTP_STATUS_UNAUTHORIZED);
    }
    next();
};