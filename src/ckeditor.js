/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

//
// Custom GroupVine plugins
//

import GVDataProcessorPlugin from './data-proc/data-proc';
import UserAttribute from './user-attribute/user-attribute';
import InputAttribute from './inp-attribute/inp-attribute';
//import MoreGroup from './more-group/moregroup'; 
//import FontGroup from './font-group/fontgroup'; 
//import ListGroup from './list-group/listgroup'; 
//import AlignGroup from './align-group/aligngroup'; 

import Placeholder from './placeholder';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
        // WEIRD ... Just including this demo plugin makes the bug go away
        // that was resulting in the editor hanging when selecting custom 
        // widgets in the editor, in the reverse direction (selecting then 
        // dragging cursor toward top of page).  Is this causing a
        // a needed library to be pulled in, or overwritten with fixed one??
        Placeholder,  

	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,


        // GroupVine plugins
        GVDataProcessorPlugin,
//        UserAttribute,
        InputAttribute
//        MoreGroup,
//        FontGroup,
//        ListGroup,
//        AlignGroup
];

// Editor configuration.
ClassicEditor.defaultConfig = {
        // For CKEditor demo widget:
        placeholderProps: {
            types: ["First Name", "Date"],
        },

        fontSize: {
            options: [
                8,
                10,
                12,
                'default',
                16,
                18,
                20,
                24,
                28,
                32,
                40,
                50
            ]
        },

	toolbar: {
		items: [
                        "placeholder",  // CKEditor Demo widget
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
                        'gv-metatag',
                        'gv-input-attribute',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},

        heading: {
            options: [
                // view.name and view.classes will apply to generated HTML; class will apply to heading in Editor dropdown
                { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: {name : 'h1', classes : 'gv-h1'}, title: 'Title', class: 'ck-heading_heading1 gv-heading1' },
                { model: 'heading2', view: {name : 'h2', classes : 'gv-h2'}, title: 'Section', class: 'ck-heading_heading2 gv-heading2' },
                { model: 'heading3', view: {name : 'h3', classes : 'gv-h3'}, title: 'Subsection', class: 'ck-heading_heading3 gv-heading3' }
            ]
        },

	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
