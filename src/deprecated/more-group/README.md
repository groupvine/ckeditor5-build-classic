## Origin

This more-group module was from a proposed mod for CKEditor5 added to github at:

```
packages/ckeditor5-toolbar-group/README.md
```

## Documentation

```html
This package contains CKEditor 5 features allowing to group multiple toolbar items in a "more" dropdown list using any custom ckeditor5 build

1. Add "moregroup" to the toolbar.items array as shown below
2. add a moreGroup object to the editor.config and set the required parameters.

The moreGroup accepts an option array with a model and title property respectively.

Values for the model is same as toolbar.items array, while the values for the title is optional. if you want a custom title, then you can set that option as desired

An example is shown below
```

```js 
import MoreGroup from '<path>/<to>/moregroup'; 
    
    Editor.create( document.querySelector( '#editor' ),{
            
                     toolbar: {
                items: [ 'bold', 'italic','underline','highlight','moregroup']
            },
            moreGroup: {
                options: [
                    { model: 'paragraph', title: 'Paragraph' },
                    { model: 'heading1',  title: 'Heading 1' },
                    { model: 'heading2', title: 'Heading 2' },
                    { model: 'link'},
                ]
            },
                } )
                  .then(...)
                        .catch(...);
```
