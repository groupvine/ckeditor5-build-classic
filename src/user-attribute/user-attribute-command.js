import Command from '@ckeditor/ckeditor5-core/src/command';

export default class UserAttributeCommand extends Command {

    execute( { value } ) {
        const editor = this.editor;

        editor.model.change( writer => {
            // Create a <gv-metatag> elment with name "type" attribute...
            const userAtt = writer.createElement( 'gv-metatag', { type: value } );

            // ... and insert it into the document.
            editor.model.insertContent( userAtt );

            // Put the selection *after* the inserted element.
            writer.setSelection( userAtt, 'after' );  // was: 'on'

            // Add space, to avoid problem where the gv-metatag is deleted for some
            // reason after immidately typing a space after the gv-metatag
            // No longer needed after v15 upgrade?
            // writer.insertText( ' ', userAtt, 'after' );

            /*
            // From: https://stackoverflow.com/questions/54162496/ckeditor5-insert-text-without-breaking-current-element
            const selection = editor.model.document.selection;
            const currentAttributes = selection.getAttributes();
            const insertPosition = selection.focus;

            writer.insertText( ' ', currentAttributes, insertPosition );
            */

        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild( selection.focus.parent, 'gv-metatag' );

        this.isEnabled = isAllowed;
    }
}