      //  Define changes to default configuration here. For example:
      config.language = 'fr';
      config.uiColor = '#AADC6E';
      extraPlugins: 'lineutils,mathjax,widget',

      // MathJax config
      mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML',

      /* Filebrowser routes */
      // The location of an external file browser, that should be launched when "Browse Server" button is pressed.
      filebrowserBrowseUrl: "/ckeditor/attachment_files",

      // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Flash dialog.
      filebrowserFlashBrowseUrl: "/ckeditor/attachment_files",

      // The location of a script that handles file uploads in the Flash dialog.
      filebrowserFlashUploadUrl: "/ckeditor/attachment_files",

      // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Link tab of Image dialog.
      filebrowserImageBrowseLinkUrl: "/ckeditor/pictures",

      // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Image dialog.
      filebrowserImageBrowseUrl: "/ckeditor/pictures",

      // The location of a script that handles file uploads in the Image dialog.
      filebrowserImageUploadUrl: "/ckeditor/pictures",

      // The location of a script that handles file uploads.
      filebrowserUploadUrl: "/ckeditor/attachment_files",

      allowedContent: true,

      // Toolbar groups configuration.
      toolbar: [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'SpecialChar', 'Mathjax' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        '/',
        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] }
      ]