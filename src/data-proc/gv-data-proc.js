import HtmlDataProcessor from  '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

import { convertMetaImgsToView } from '../lib';

export default class GVDataProcessor {
    constructor(editor) {
        this._htmlProc = new HtmlDataProcessor(editor.data.viewDocument);
    }

    toData( viewFragment ) {
        return this._htmlProc.toData(viewFragment);
    }

    toView( data ) {
        // Convert metaimg tags to tags like <span
        // class="gv-metatag">... </span> to avoid CKEditor5 core
        // conversions from changing <img> tags to <figure><img>...
        console.log("DataProcessor.toView", data.toString());

        let newData = convertMetaImgsToView(data);

        // console.log("HTML to send to HTMLDataProcessor: " + data);
        
        //
        // Now use original HTMLDataProcessor's toView() 
        //

        let viewData = this._htmlProc.toView(newData);

        return viewData;
    }
}