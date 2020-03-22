import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import  ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';


export default class EmailWidgetUI extends Plugin {

    init() {
        const editor   = this.editor;
        const t = editor.t;   // translator, used in t() calls below
        const widgetConfig = this.editor.config.get('emailWidget');

        const emailWidgetTypes = widgetConfig['types'];
        const canAddWidget     = widgetConfig['canAddWidget'];
        const assignEwId       = widgetConfig['assignEwId'];      // BTW can't use editor.config.get() directly for 
        const configEwDialog   = widgetConfig['configEwDialog'];  //     callback functions, like these two

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
                    if (assignEwId == null) {
                        return alert("ERROR: no callback has been configured for assigning the EW Id");
                    }

                    let ewId = assignEwId(type, (ewId) => {
                        if (ewId == null) {
                            alert("Sorry, unable to reach Email Widget server to create a new Email Widget");
                        } else if (ewId === false) {
                            alert("Sorry, you already have the maximum number of Email Widgets " +
                                  "permitted in a single email at your service level");
                        } else {
                            editor.execute( 'gv-metatag', { value: type, ewId : ewId } );
                            editor.editing.view.focus();
                        }
                    });
                };
            } );

            return dropdownView;
        });

        //
        // Register for click events
        // see: https://github.com/ckeditor/ckeditor5/issues/2077
        //

        const view = editor.editing.view;
        const viewDocument = view.document;

        view.addObserver( ClickObserver );  // Only do this once per editor instance I assume?

        editor.listenTo( viewDocument, 'click', ( evt, data ) => {
            const modelElement = editor.editing.mapper.toModelElement( data.target );

            if ( modelElement == null || modelElement.name !== 'gv-metatag' ) {
                return;
            }

            let type = modelElement.getAttribute('type');
            if (type == null || !type.startsWith('ew/')) {
                return;
            }

            if (configEwDialog) {
                configEwDialog({
                    type : modelElement.getAttribute('type'),
                    ewId : modelElement.getAttribute('ewId')
                });
            }
        });
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
