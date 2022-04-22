/**
 * @module AdminController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const status = require('http2').constants;

const { seasonModel } = require('../models');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function index(req, res) {
    if(!req.session.authenticated) {
        return res.sendStatus(status.HTTP_STATUS_UNAUTHORIZED);
    }
    res.render('admin/index');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function login(req, res) {
    // TODO: implement anti ddos
    //req.ip
    if(req.session.authenticated) {
        return res.redirect('/admin/');
    }
    switch(req.method) {
        case 'GET':
            res.locals.error = req.session.loginError;
            delete req.session.loginError;
            res.render('admin/login');
            break;
        case 'POST':
            const pass = 'gonnagetitright'
            if(req.body.pass === pass) {
                req.session.authenticated = true;
                return res.redirect('/admin/');
            }
            req.session.loginError = true;
            res.redirect('/admin/login/');
            break;
        default:
            // TODO: show 404
            res.sendStatus(status.HTTP_STATUS_NOT_FOUND);
            break;
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function seasons(req, res) {
    res.locals.seasons = await seasonModel.all();
    res.render('admin/seasons/index');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function season(req, res) {
    res.locals.error = {};
    const id = req.params.id;
    switch(req.method) {
        case 'GET':
            let season = {};
            if(id) {
                season = await seasonModel.find(id);
            }
            res.locals.season = season;
            res.render('admin/seasons/season');
            break;
        case 'POST':
            // remove empty values
            Object.keys(req.body).forEach((k) => !req.body[k] && delete req.body[k]);
            if(id) {
                await seasonModel.update(id, req.body);
            } else {
                await seasonModel.insert(req.body);
            }
            res.redirect('/admin/seasons/');
            break;
        default:
            res.sendStatus(status.HTTP_STATUS_NOT_FOUND);
            break;
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteSeason(req, res) {
    await seasonModel.remove(req.params.id);
    res.redirect('/admin/seasons/');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function images(req, res) {

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function image(req, res) {
    
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function deleteImage(req, res) {

}

module.exports = {
    index,
    login,
    seasons,
    season,
    deleteSeason,
    images,
    image,
    deleteImage
};