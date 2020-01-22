import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';


export default class EmailWidgetEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        // console.log( 'EmailWidgetEditing#init() got called' );

        this.editor.config.define( 'emailWidget', {
            types: [
                { label : 'Comments',     type : 'sew/comments' },
                { label : 'Simple RSVP',  type : 'sew/rsvp'  },
                { label : 'How Many?',    type : 'sew/howmany'     }
            ]
        } );
    }
}

