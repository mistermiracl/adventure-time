/**
 * @module SeasonsController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const status = require('http2').constants;

const cloudStorage = require('../common/cloud-storage');
const { seasonModel, chapterModel } = require('../models');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function index(req, res) {
    const slug = req.params.slug;
    const seasons = await seasonModel.allActive();
    if(!slug) {
        return res.redirect('/seasons/' + seasons[0].slug);
    }
    // TODO: move this for every action since we want to gather all seasons on most renders, it should e a partial
    const season = seasons.filter(s => s.slug === slug)[0];
    if(!season) {
        return res.sendStatus(status.HTTP_STATUS_NOT_FOUND);
    }
    const episodes = await chapterModel.allBySeason(season.id);
    episodes.forEach(e => e.poster = cloudStorage.publicUrl(e.poster));
    
    res.locals.seasons = seasons;
    res.locals.episodes = episodes;
    
    res.render('seasons/index');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function chapter(req, res) {
    const slug = req.params.seasonSlug;
    const seasons = await seasonModel.allActive();
    const season = seasons.filter(s => s.slug === slug)[0];
    if(!season) {
        return res.sendStatus(status.HTTP_STATUS_NOT_FOUND);
    }
    const chapterSlug = req.params.chapterSlug;
    const chapter = await chapterModel.findBySlug(chapterSlug);
    chapter.poster = cloudStorage.publicUrl(chapter.poster);
    chapter.source = cloudStorage.publicUrl(chapter.source);

    res.locals.seasons = seasons;
    res.locals.season = season;
    res.locals.chapter = chapter;
    res.locals.title = chapter.name;

    res.render('seasons/chapter');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function chapters(req, res) {
    const id = req.params.id;
    const chapters = await chapterModel.allBySeason(id);
    // TODO: doing this too many times, simplify it
    chapters.forEach(c => c.poster = cloudStorage.publicUrl(c.poster));

    res.send(chapters);
}

module.exports = {
    index,
    chapter,
    chapters
};