import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';


export default class EmailWidgetUI extends Plugin {

    init() {
        const editor   = this.editor;
        const t = editor.t;   // translator, used in t() calls below
        const emailWidgetTypes = this.editor.config.get('emailWidget.types');

        // The "email-widget" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'gv-email-widget', locale => {
            const dropdownView = createDropdown( locale );

            // Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( emailWidgetTypes ) );

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Widget' ),
                tooltip: "Insert email widget",
                withText: true
            } );

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( 'gv-metatag', { value: evt.source.commandParam } );
                editor.editing.view.focus();
            } );

            return dropdownView;
        } );
    }
}

function getDropdownItemsDefinitions( emailWidgetTypes ) {
    const itemDefinitions = new Collection();

    for ( const typeObj of emailWidgetTypes ) {
        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: typeObj.type,
                label: typeObj.label,
                withText: true
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    return itemDefinitions;
}
