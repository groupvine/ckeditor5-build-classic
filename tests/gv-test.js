ClassicEditor.create( document.querySelector( '#editor' ), {
    userAttribute: {
        metaImgBaseUrl : 'http://metaimg.localhost.test:8098'
    },
    emailWidget: {
        assignEwId : function(type, cb) { 
            cb(123);
        }
    },
    heading: {
        options: [
            // view.name and view.classes will apply to generated HTML; class will apply to heading in Editor dropdown
            { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: {name : 'h1', classes : 'gv-h1'}, title: 'Heading 1', class: 'ck-heading_heading1 gv-heading1' },
            { model: 'heading2', view: {name : 'h2', classes : 'gv-h2'}, title: 'Heading 2', class: 'ck-heading_heading2 gv-heading2' },
            { model: 'heading3', view: {name : 'h3', classes : 'gv-h3'}, title: 'Heading 3', class: 'ck-heading_heading3 gv-heading3' }
        ]
    }



}).then( editor => {

    window.editor = editor;
    console.log( "STARTED" );

    const modelDocument = editor.model.document;

    function updatePreview() {
        let content = editor.getData();
        // console.log("New content: ", content);
        document.getElementById('preview').innerHTML = content;
    }

    modelDocument.on( 'change:data',  ev => {
        updatePreview();
    });

    // Set initial content
    setTimeout( () => {
        updatePreview();
    }, 100);

    CKEditorInspector.attach( editor );

}).catch( err => {
    console.error( err.stack );
});
