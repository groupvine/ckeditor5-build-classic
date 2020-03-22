import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import  ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';


export default class EmailWidgetEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        // console.log( 'EmailWidgetEditing#init() got called' );

        this.editor.config.define( 'emailWidget', {
            canAddWidget : true,
            types: [
                { label : 'Comments',     type : 'ew/comments' },
                { label : 'Simple RSVP',  type : 'ew/rsvp'  },
                { label : 'How Many?',    type : 'ew/howmany'     }
            ]
        } );

        //
        // Register for click events
        // see: https://github.com/ckeditor/ckeditor5/issues/2077
        //

        const view = this.editor.editing.view;
        const viewDocument = view.document;

        view.addObserver( ClickObserver );  // Only do this once per editor instance I assume?

        this.editor.listenTo( viewDocument, 'click', ( evt, data ) => {
            const modelElement = this.editor.editing.mapper.toModelElement( data.target );

            if ( modelElement == null || modelElement.name !== 'gv-metatag' ) {
                return;
            }

            let type = modelElement.getAttribute('type');
            if (type == null || !type.startsWith('ew/')) {
                return;
            }

            console.log("Clicked on gv-metatag of type: " + modelElement.getAttribute('type'))
        });
    }
}

