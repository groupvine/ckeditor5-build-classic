import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import UserAttributeCommand from './user-attribute-command';

import './theme/user-attribute.css';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';


export default class UserAttributeEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        // console.log( 'UserAttributeEditing#init() got called' );
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'gv-metatag', new UserAttributeCommand( this.editor ) );

        this.editor.config.define( 'userAttribute', {
            types: [
                { label : 'First Name', type : 'attribute/firstname' },
                { label : 'Last Name',  type : 'attribute/lastname'  },
                { label : 'Email',      type : 'attribute/email'     }
            ],
            metaImgBaseUrl: null    // null default, so this is required
        } );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'gv-metatag', {
            // Allow wherever text is allowed plus in tableCells
            allowIn: 'tableCell',
            allowWhere: '$text',

            // The user-attribute will act as an inline node:
            isInline: true,

            // The inline widget is self-contained so it cannot be split by the caret and can be selected:
            isObject: true,

            // The user-attribute can have many types, firstname, lastname, email, id, etc.
            allowAttributes: [ 'type' ]
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        const metaImgBaseUrl = this.editor.config.get('userAttribute.metaImgBaseUrl');

        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'span',
                classes: [ 'gv-metatag' ],
                converterPriority: 'highest'  // be sure it converts ahead of regular images
            },
            model: ( viewElement, modelWriter ) => {
                // Extract the "type" from the src URL
                const attType = viewElement.getChild(0).data.trim();
                // console.log("Upcast: " + attType);
                return modelWriter.createElement( 'gv-metatag', { type : attType } );
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'gv-metatag',
            view: ( modelItem, viewWriter ) => {
                const widgetElement = createUserAttributeView( modelItem, viewWriter );

                // Enable widget handling on a gv-metatag element inside the editing view.
                return toWidget( widgetElement, viewWriter );
            }
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'gv-metatag',
            view: createUserAttributeView
        } );

        // Helper method for both downcast converters.
        function createUserAttributeView( modelItem, viewWriter ) {
            const attType = modelItem.getAttribute( 'type' );

            const userAttributeView = viewWriter.createContainerElement( 'img', {
                 src : metaImgBaseUrl + '/' + attType
            } );
            // console.log("Downcast: " + attType);

            return userAttributeView;
        }
    }
}
