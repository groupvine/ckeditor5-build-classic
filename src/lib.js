import { load as htmlRead } from 'cheerio-nunjucks';
import { html as htmlWrite } from 'cheerio-nunjucks';

const urlParse = require('url-parse');

function checkForMetaImg($, elem, options) {
    if (!options) { options = {}; }

    let change = false;
    let $elem = $(elem);
    let imgSrc;

    let tagName = $elem.get(0).tagName ? $elem.get(0).tagName.toLowerCase() : '';

    if (tagName === 'figure') {
        let $img = $elem.find('img');
        imgSrc = $img.attr('src');   // gets 'src' of first matched element
    } else {
        imgSrc = $elem.attr('src');
    }

    if (!imgSrc) {
        return false;
    }

    let parsed = urlParse(imgSrc, true);
    if (!parsed) {
        return false;
    }

    let host = parsed.hostname.toLowerCase();

    // TODO: Paramaterize?
    if (!host.startsWith('metaimg.localhost') &&
        !host.startsWith('metaimg.groupvine') &&
        !host.startsWith('metaimg.trivy')) {
        return false;
    }

    let parts = parsed.pathname.split('/');
    if (parts.length < 3) {
        return false;
    }

    let macroType = parts[1];
    let microType = parts[2];

    if (options.ewOnly) {
        if (macroType.toLowerCase() !== 'ew') {
            return false;
        }
    }

    let attNames = Object.keys(parsed.query);
    let dataAtts = [];
    for (let i = 0; i < attNames.length; i++) {
        dataAtts.push('data-' + attNames[i] + '=' + parsed.query[attNames[i]]);
    }

    let dataAttStr = dataAtts.join(' ');
    if (dataAttStr) {
        dataAttStr = ' ' + dataAttStr;
    }

    let newElem = `<span class="gv-metatag"${dataAttStr}>${macroType}/${microType}</span>`;

    if (tagName === 'figure') {
        newElem = `<p> ${newElem} </p>`;
    }
    
    $elem.replaceWith(newElem);

    return true;  // change was made
};


export function convertMetaImgsToView(data) {

    let $ = htmlRead(data);

    // Check <figure>s first, so we replace entire figure element
    // if the embedded img is a GV metaimg
    $('figure').each( (i, elem) => {
        checkForMetaImg($, elem);
    });

    // Then check individual images (i.e., include those that aren't
    // wrapped in <figure>s
    $('img').each( (i, elem) => {
        checkForMetaImg($, elem);
    });

    data = htmlWrite($);  // Render result

    return data;
}

export function anyMetaImgEWs(data) {
    let $ = htmlRead(data);

    let isChange = false;

    // Check <figure>s first, so we replace entire figure element
    // if the embedded img is a GV metaimg
    $('figure').each( (i, elem) => {
        if ( checkForMetaImg($, elem, {ewOnly:true}) ) {
            isChange = true;
            return false;
        }
        return true;  // continue
    });

    if (isChange) {
        return true;
    }

    // Then check individual images (i.e., include those that aren't
    // wrapped in <figure>s
    $('img').each( (i, elem) => {
        if ( checkForMetaImg($, elem, {ewOnly:true}) ) {
            isChange = true;
            return false;
        }
        return true;  // continue
    });

    return isChange;
}


