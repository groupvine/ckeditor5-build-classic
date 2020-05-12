import HtmlDataProcessor from  '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

import { convertMetaImgsToView } from '../lib';

export default class GVDataProcessor {
    constructor(editor) {
        this._htmlProc = new HtmlDataProcessor(editor.data.viewDocument);
    }

    toData( viewFragment ) {
        console.log("DataProcessor.toData:", viewFragment.toString());
        return this._htmlProc.toData(viewFragment);
    }

    toView( data ) {
        // Convert metaimg tags to tags like <span
        // class="gv-metatag">... </span> to avoid CKEditor5 core
        // conversions from changing <img> tags to <figure><img>...
        console.log("DataProcessor.toView pre:", data.toString());

        let newData = convertMetaImgsToView(data);

        //
        // Now use original HTMLDataProcessor's toView() 
        //

        if (newData) {
            console.log("DataProcessor.toView post:", newData.toString());
        } else {
            console.log("DataProcessor.toView post: null!?");
        }

        let viewData = this._htmlProc.toView(newData);

        if (viewData) {
            console.log("DataProcessor.toView done:", viewData.toString());
        } else {
            console.log("DataProcessor.toView done: null!?");
        }

        return viewData;
    }
}