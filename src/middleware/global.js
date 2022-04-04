/**
 * @module GlobalMiddleware
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
    res.locals.currentUrl = req.url;
    next();
};