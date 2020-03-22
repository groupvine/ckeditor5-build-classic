import HtmlDataProcessor from  '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

import { load as htmlRead } from 'cheerio-nunjucks';
import { html as htmlWrite } from 'cheerio-nunjucks';

const urlParse = require('url-parse');

export default class GVDataProcessor {
    constructor() {
        this._htmlProc = new HtmlDataProcessor();
    }

    toData( viewFragment ) {
        return this._htmlProc.toData(viewFragment);
    }

    toView( data ) {
        // Convert metaimg tags to tags like <span
        // class="gv-metatag">... </span> to avoid CKEditor5 core
        // conversions from changing <img> tags to <figure><img>...

        let $ = htmlRead(data);

        function checkForMetaImg(elem) {
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
                return true; // continue loop
            }

            let parsed = urlParse(imgSrc, true);
            if (!parsed) {
                return true;
            }

            let host = parsed.hostname.toLowerCase();

            // TODO: Paramaterize?
            if (!host.startsWith('metaimg.localhost') &&
                !host.startsWith('metaimg.groupvine') &&
                !host.startsWith('metaimg.trivy')) {
                return true; // continue loop
            }

            let parts = parsed.pathname.split('/');
            if (parts.length < 3) {
                return true; // continue loop
            }

            let macroType = parts[1];
            let microType = parts[2];

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
        }

        // Check <figure>s first, so we replace entire figure element
        // if the embedded img is a GV metaimg
        $('figure').each( (i, elem) => {
            checkForMetaImg(elem);
        });

        // Then check individual images (i.e., include those that aren't
        // wrapped in <figure>s
        $('img').each( (i, elem) => {
            checkForMetaImg(elem);
        });

        data = htmlWrite($);  // Render result

        // console.log("HTML to send to HTMLDataProcessor: " + data);
        
        //
        // Now use original HTMLDataProcessor's toView() 
        //

        let viewData = this._htmlProc.toView(data);

        return viewData;
    }
}