/**
 * @module IndexController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function index(req, res) {
    res.render('index/index');
}

module.exports = {
    index
};