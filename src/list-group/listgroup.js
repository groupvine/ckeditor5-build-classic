import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
//import necessary view components for the toolbar
import MenuIcon from '@ckeditor/ckeditor5-list/theme/icons/bulletedlist.svg'
import {addToolbarToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';



export default class ListGroup extends Plugin {

    static get pluginName() {
        return 'ListGroup';
        }

    constructor( editor ) {

        super( editor );

        this.groupTitle = this._groupTitle();

        this.textOption = this._textOption();

        this.icon = MenuIcon;
        }

    init() {
        
        const editor  = this.editor;
        const t       = editor.t;
        const config  = editor.config.get('listGroup');
        const factory = editor.ui.componentFactory;

        factory.add( 'listgroup', locale => {

            const buttons = [];

            for(const option of config.options){
                
                const view = factory.create( option.model );

                if (view.hasOwnProperty('buttonView')) {

                    view.buttonView.set({
                        withText : true,
                        tooltip : false,
                        label : option.title || view.buttonView.label,
                        })

                    }else{

                        view.set({
                            withText : true,
                            tooltip : false,
                            label : option.title || view.label,
                            })
                        
                        }

                buttons.push( view );
                }
            //create dropdown view
            const dropdownView = createDropdown(locale);

                    dropdownView.buttonView.set( {
                            withText: this.textOption,
                            label: t(this.groupTitle),
                            icon: MenuIcon,
                            tooltip: true,
                            class:'list_group'
                        } );
                    //add to toolbar
            addToolbarToDropdown( dropdownView, buttons );
            dropdownView.toolbarView.isVertical = true;
            
            return dropdownView;
        } );

    }

    _groupTitle(){
        const editor  = this.editor;
        const config  = editor.config.get('listGroup');
        const title   = 'List Options';
        if (config !== undefined) {
            return config.title || title;
        }
        return title;
    }

    _textOption(){
        const editor  = this.editor;
        const config  = editor.config.get('listGroup');
        if (config !== undefined) {
            return config.hasOwnProperty('title');
        }
        return false;
    }
}
