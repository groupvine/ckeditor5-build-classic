ClassicEditor.create( document.querySelector( '#editor' ), {
    debugLevel: 10,

    userAttribute: {
        metaImgBaseUrl : 'http://metaimg.localhost.test:8098'
    },
    emailWidget: {
        assignEwId : function(type, cb) { 
            cb({ewId: 123});
        },
        createEwDialog : function(cb) {
            cb({ewType: 'ew/testname', ewId: 123});
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

    editor.setData(initContent);

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


const initContent = `
  <style>
    .gv-h2 {
      color:white;
      background-color:green;
    }
    .gv-heading2 {
      color:white !important;
      background-color:green !important;
    }

    .ck.ck-dropdown .ck-button.ck-dropdown__button .ck-button__label {
      width: 5.5em;
    }
    .ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__panel .ck-list__item {
      min-width: 10em;
    }

    .ck.ck-dropdown .ck-dropdown__arrow {
      display:none;
    }

    .ck-dropdown__panel {
      max-height: 250px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  </style>

  <div id="content">

    Hello there <img src="http://metaimg.localhost.test:8098/attribute/firstname">,

    <p>
      <img src="http://metaimg.localhost.test:8098/ew/count?ewid=36">
    </p>

    <p>
      <img src="http://metaimg.localhost.test:8098/ew/feedback?ewid=22">
    </p>

    <!--
      <span class="placeholder">{First name}</span>
      <span class="placeholder">{Last name}</span>
    -->

    <div class="gv-input-attribute" data-type="optedout"></div>

    <div class="gv-input-attribute" data-type="optedout"></div>

    <h2 class="gv-h2">
      DB: Here's the main heading
    </h2>

    <h4>
        <strong>Attributes</strong>
    </h4>

    <figure class="table">
      <table>
        <tbody>
          <tr>
            <td>
              <div class="gv-input-attribute" data-type="list">here's the inp attribute</div>
            </td>
            <td>
              Some text after
            </td>
          </tr>
        </tbody>
      </table>
    </figure>

    <div class="gv-input-attribute" data-type="group"></div>
    <div class="gv-input-attribute" data-type="email"></div>
    <div class="gv-input-attribute" data-type="mobilenumber"></div>
    <div class="gv-input-attribute" data-type="mobileservice"></div>
    <div class="gv-input-attribute" data-type="textingmode"></div>
    <div class="gv-input-attribute" data-type="list"></div>

  </div>
`;