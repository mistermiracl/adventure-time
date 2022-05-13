/**
 * @module AdminController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const status = require('http2').constants;

const { seasonModel, chapterModel, rotatingImagePairModel } = require('../models');
const cloudStorage = require('../common/cloud-storage');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function index(req, res) {
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
            req.body.special = req.body.special === 'on' ? true : false;
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
    res.send('ok');
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

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function chapters(req, res) {
    var seasonId = req.query.seasonId;
    if(!seasonId) {
        seasonId = (await seasonModel.findByNumber(1)).id;
    }
    var chapters;
    chapters = await chapterModel.allBySeason(seasonId);
    chapters.forEach(c => {
        c.posterUrl = cloudStorage.publicUrl(c.poster);
        c.sourceUrl = cloudStorage.publicUrl(c.source);
    });
    
    res.locals.selectedSeasonId = seasonId;
    res.locals.chapters = chapters;
    res.locals.seasons = await seasonModel.all();
    
    res.render('admin/chapters/index');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function chapter(req, res) {
    const id = req.params.id;
    const seasonId = req.query.seasonId;
    
    var chapter;
    res.locals.errors = {};
    switch(req.method) {
        case 'GET':
            chapter = {};
            if(id) {
                chapter = await chapterModel.find(id, seasonId);
                chapter.posterUrl = cloudStorage.publicUrl(chapter.poster);
                chapter.sourceUrl = cloudStorage.publicUrl(chapter.source);
            }
            res.locals.chapter = chapter;
            res.locals.seasonId = seasonId;
            res.render('admin/chapters/chapter');
            break;
        case 'POST':
            const poster = req.files['poster'];
            const objectPrefix = seasonId + '/';
            if(id) {
                console.log('Retrieving chapter');
                let chapter = await chapterModel.find(id, seasonId);
                if(poster) {
                    console.log('There is a poster: ' + poster);
                    const prevPosterName = chapter.poster;
                    if(prevPosterName) {
                        console.log('Removing previous poster');
                        await cloudStorage.remove(prevPosterName);
                    }
                    const posterName = await cloudStorage.upload(objectPrefix, poster);
                    chapter.poster = posterName;
                }
                if(req.body.source !== chapter.source) {
                    console.log('There is a new source: ' + chapter.source);
                    console.log('Removing previous source');
                    await cloudStorage.remove(chapter.source);
                }
                chapter = { ...chapter, ...req.body };
                console.log('Updating chapter');
                await chapterModel.update(chapter);
            } else {
                const chapter = req.body;
                const posterName = await cloudStorage.upload(objectPrefix, poster);
                chapter.poster = posterName;
                await chapterModel.insert(chapter, seasonId);
                // console.log(res[0].mutationResults[0].key);
            }

            res.redirect('/admin/chapters/?seasonId=' + seasonId);
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
async function chapterUpload(req, res) {
    const seasonId = req.body.seasonId;
    const filename = req.body.filename;
    const mimeType = req.body.mimeType;
    const objectPrefix = seasonId + '/';
    const [ key, signedUrl ] = await cloudStorage.generateSignedWriteUrl(objectPrefix, filename, mimeType);
    res.send({
        key,
        signedUrl
    });
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteChapter(req, res) {
    const id = req.params.id;
    const seasonId = req.query.seasonId;
    const chapter = await chapterModel.find(id, seasonId);
    await cloudStorage.remove(chapter.poster);
    await cloudStorage.remove(chapter.source);
    await chapterModel.remove(id, seasonId);
    res.redirect('/admin/chapters/?seasonId=' + seasonId);
}


/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteChapterSource(req, res) {
    const id = req.params.id;
    const seasonId = req.query.seasonId;
    const chapter = await chapterModel.find(id, seasonId);
    await cloudStorage.remove(chapter.source);
    // TODO: remove source from database
    // chapter.source = null;
    // await chapterModel.update(chapter);
    res.send('ok');
}

module.exports = {
    index,
    login,
    seasons,
    season,
    deleteSeason,
    chapters,
    chapter,
    chapterUpload,
    deleteChapter,
    deleteChapterSource,
    images,
    image,
    deleteImage
};