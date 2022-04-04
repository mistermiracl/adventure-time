/**
 * @module ChapterController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function index(req, res) {
    res.send('Chapter working!');
}

module.exports = {
    index
};