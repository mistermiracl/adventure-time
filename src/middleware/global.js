/**
 * @module GlobalMiddleware
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const path = require('path');
const fs = require('fs');

const config = require('../config');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
function trace(req, res, next) {
    res.on('finish', () => {
        console.log(`${req.method} ${req.url} [${res.statusMessage} ${res.statusCode}]`);
    });
    next();
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
function formatUrl(req, res, next) {
    const [ url, query ] = req.url.split('?');
    if(!url.endsWith('/')) {
        return res.redirect(`${url}/${query ? query : ''}`);
    }
    next();
};

/**
 * Returns a heroicons svg
 * @param {string} name heroicon name, prefixed with "hero-"
 */
function svg(name, className) {
    const nameParts = name.split('-');
    if(nameParts.length >= 3) {
        // TODO: does fs.readFileSync block the event loop? / in a significant way?, i know it's not the nodejs way
        // NOTE: make the readfile async?
        // NOTE: add all the svg in the public directory?
        const heroiconType = nameParts[1];
        const heroiconName = nameParts.slice(2).join('-') + '.svg';

        if (nameParts[0] == 'hero' && (heroiconType === 's' || heroiconType === 'o')) {   
            var heroiconsTypeFolder = '';
            if(heroiconType == 's') {
                heroiconsTypeFolder = 'solid';
            } else if(heroiconType == 'o') {
                heroiconsTypeFolder = 'outline';
            }

            try {
                const svg = fs.readFileSync(path.join(config.projectRoot, 'node_modules', 'heroicons', heroiconsTypeFolder, heroiconName)).toString();
                const svgParts = svg.split('<svg ');
                return `<svg ${className ? `class="${className}"` : ''} ${svgParts[1]}`;
            } catch(e) {
                throw e;
            }
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
function viewHelpers(req, res, next) {
    res.locals.currentUrl = req.url;
    res.locals.svg = svg
    next();
}

module.exports = [trace, formatUrl, viewHelpers];