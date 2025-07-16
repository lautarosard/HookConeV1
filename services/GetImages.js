const axios = require('axios');
const cheerio = require('cheerio');
const { obtenerImagenReddit } = require('./GetImagenReddit');

async function obtenerImagenDesdeURL(url) {
    if (!url) return null;

    if (esReddit(url)) {
        return await obtenerImagenReddit(url);
    }

    // Otras plataformas irían después
    return null;
}

function esReddit(url) {
    return url.includes('reddit.com');
}

module.exports = { obtenerImagenDesdeURL };