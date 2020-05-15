import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import  ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

import { DoubleClickObserver } from '../dblclick/dblclick';

export default class EmailWidgetUI extends Plugin {

    init() {
        const editor   = this.editor;
        const t = editor.t;   // translator, used in t() calls below
        const widgetConfig = this.editor.config.get('emailWidget');

        const emailWidgetTypes = widgetConfig['types'];
        const canAddWidget     = widgetConfig['canAddWidget'];
        const assignEwId       = widgetConfig['assignEwId'];      // BTW can't use editor.config.get() directly for 
        const configEwDialog   = widgetConfig['configEwDialog'];  //     callback functions
        const createEwDialog   = widgetConfig['createEwDialog'];  //     like these three

        // The "email-widget" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'gv-email-widget', locale => {
            const dropdownView = createDropdown( locale );

            dropdownView.set('class', 'widgetsDropdown');

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
                if (evt.source.gv_action === 'createNewEW') {
                    if (createEwDialog == null) {
                        return alert("ERROR: no callback has been configured for creating a new EW");
                    }

                    let ewId = createEwDialog( (results) => {
                        if (results.error) {
                            alert(results.error);
                        } else {
                            editor.execute( 'gv-metatag', { value: results.ewType, ewId : results.ewId } );
                            editor.editing.view.focus();
                        }
                    });

                } else if (evt.source.gv_action === 'insertStdEW') {
                    let type = evt.source.commandParam;
                    if (assignEwId == null) {
                        return alert("ERROR: no callback has been configured for assigning the EW Id");
                    }

                    let ewId = assignEwId(type, (results) => {
                        if (results.error) {
                            alert(results.error);
                        } else {
                            editor.execute( 'gv-metatag', { value: type, ewId : results.ewId } );
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

        // view.addObserver( ClickObserver );  // Only do this once per editor instance I assume?
        view.addObserver( DoubleClickObserver );  // Only do this once per editor instance I assume?

        editor.listenTo( viewDocument, 'dblclick', ( evt, data ) => {
            const modelElement = editor.editing.mapper.toModelElement( data.target );

            if ( modelElement == null || modelElement.name !== 'gv-metatag' ) {
                return;
            }

            let type = modelElement.getAttribute('type');
            if (type == null || !type.startsWith('ew/')) {
                return;
            }

            if (configEwDialog) {
                configEwDialog(modelElement.getAttribute('type'),
                               modelElement.getAttribute('ewId'));
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
                gv_action: 'insertStdEW'
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    if (canAddWidget) {
        itemDefinitions.add({
            type: 'button',
            model: new Model({
                label: 'Custom Choice', // TODO if nec., pass in label
                withText: true,
                gv_action: 'createNewEW'
            })
        });
    }

    return itemDefinitions;
}
