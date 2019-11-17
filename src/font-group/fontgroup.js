import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
//import necessary view components for the toolbar
// import MenuIcon from '@ckeditor/ckeditor5-font/theme/icons/font-family.svg';
import MenuIcon from '@ckeditor/ckeditor5-basic-styles/theme/icons/italic.svg';
import {addToolbarToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';



export default class FontGroup extends Plugin {

    static get pluginName() {
        return 'FontGroup';
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
        const config  = editor.config.get('fontGroup');
        const factory = editor.ui.componentFactory;

        factory.add( 'fontgroup', locale => {

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
                            class:'font_group'
                        } );
                    //add to toolbar
            addToolbarToDropdown( dropdownView, buttons );
            dropdownView.toolbarView.isVertical = true;
            
            return dropdownView;
        } );

    }

    _groupTitle(){
        const editor  = this.editor;
        const config  = editor.config.get('fontGroup');
        const title   = 'Font Options';
        if (config !== undefined) {
            return config.title || title;
        }
        return title;
    }

    _textOption(){
        const editor  = this.editor;
        const config  = editor.config.get('fontGroup');
        if (config !== undefined) {
            return config.hasOwnProperty('title');
        }
        return false;
    }
}
