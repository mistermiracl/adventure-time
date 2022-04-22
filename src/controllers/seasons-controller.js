/**
 * @module SeasonsController
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function index(req, res) {
    var seasonNumber = req.params.slug ? req.params.slug.split('-')[1] : null;
    // TODO: move this for every action since we want to gather all seasons on most renders
    const seasons = Array.from(Array(10).keys()).map(e => e + 1);
    if(!seasonNumber) {
        return res.redirect('/seasons/season-' + seasons[0]);
    }
    res.locals.seasons = seasons;
    res.locals.season = seasons[0];
    res.locals.episodes = [
        {
            name: 'Pilot',
            slug: 'pilot',
            description: 'The very first episode of adventure time, ojasd masohdaosjq sad asdasd21',
            poster: '/img/season-1-episode-1.webp'
        },
        {
            name: 'An awesome day',
            slug: 'an-awesome-day',
            description: 'an ok episode',
            poster: '/img/season-1-episode-2.png'
        },
        {
            name: 'An awesome day',
            slug: 'an-awesome-day',
            description: 'an ok episode',
            poster: '/img/season-1-episode-2.png'
        }
    ];
    res.render('seasons/index');
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function chapter(req, res) {
    const seasonNumber = req.params.seasonSlug ? req.params.seasonSlug.split('-')[1] : null;
    const chapterNumber = req.params.chapterSlug ? req.params.chapterSlug.split('-')[1]: null;
    res.send('alright');
}

module.exports = {
    index,
    chapter
};