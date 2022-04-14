/**
 * @module GlobalMiddleware
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const path = require('path');
const fs = require('fs');

/**
 * Returns a heroicons svg
 * @param {string} name heroicon name, prefixed with "hero-"
 */
function svg(name, className) {
    // TODO: optimized, all these conditions can be simplified by checking the split for each, reducing it to just one lookup
    if (name.startsWith('hero-') && (name.includes('-s-') || name.includes('-o-'))) {
        // NOTE: make the readfile async?
        // NOTE: add all the svg in the public directory?
        const nameParts = name.split('-');
        const heroiconType = nameParts[1];
        const heroiconName = nameParts[2] + '.svg';
        
        var heroiconsTypeFolder = '';
        if(heroiconType == 's') {
            heroiconsTypeFolder = 'solid';
        } else if(heroiconType == 'o') {
            heroiconsTypeFolder = 'outline';
        }

        try {
            const svg = fs.readFileSync(path.join(projectRoot, 'node_modules', 'heroicons', heroiconsTypeFolder, heroiconName)).toString();
            const svgParts = svg.split('<svg ');
            return `<svg ${className ? `class="${className}"` : ''} ${svgParts[1]}`;
        } catch(e) {
            throw e;
        }
    }
    return '';
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
module.exports = (req, res, next) => {
    res.locals.currentUrl = req.url;
    res.locals.svg = svg
    next();
};