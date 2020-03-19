import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';


export default class EmailWidgetUI extends Plugin {

    init() {
        const editor   = this.editor;
        const t = editor.t;   // translator, used in t() calls below
        const emailWidgetTypes = this.editor.config.get('emailWidget.types');
        const canAddWidget     = this.editor.config.get('emailWidget.canAddWidget');
        const assignEwId       = this.editor.config.get('emailWidget.assignEwId');

        // The "email-widget" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'gv-email-widget', locale => {
            const dropdownView = createDropdown( locale );

            // Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( emailWidgetTypes, canAddWidget ) );

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Widget' ),
                tooltip: "Insert email widget",
                class: 'widgetMenu',
                withText: true
            } );

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                if (evt.source.gv_action === 'event') {
                    // Deprecated method (was needed for IE, but not anymore?):
                    //   let event = document.createEvent('Event');
                    //   event.initEvent(evt.source.gv_event, true, true);

                    let event = new Event(evt.source.gv_event);
                    document.dispatchEvent(event);
                } else {
                    let type = evt.source.commandParam;
                    if (assignEwId != null) {
                        let ewId = assignEwId(type);
                        if (ewId) {
                            type += '?ewid=' + ewId;
                        }
                    }
                    editor.execute( 'gv-metatag', { value: type } );
                    editor.editing.view.focus();
                };
            } );

            return dropdownView;
        } );
    }
}

function getDropdownItemsDefinitions( emailWidgetTypes, canAddWidget ) {
    const itemDefinitions = new Collection();

    for ( const typeObj of emailWidgetTypes ) {
        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: typeObj.type,
                label: typeObj.label,
                withText: true,
                gv_action: null
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    if (canAddWidget) {
        itemDefinitions.add({
            type: 'button',
            model: new Model({
                label: 'New Email Widget',
                withText: true,
                gv_action: 'event',
                gv_event: 'editorAddWidget'
            })
        });
    }

    return itemDefinitions;
}
