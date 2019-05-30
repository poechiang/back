'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    tuwen:{
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],
                ['link','clean']                                         // remove formatting button
            ]
        }
    },
    good:{
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],
                ['link', 'image', 'video'],
                ['clean']                                         // remove formatting button
            ],
        }
    },
    demo:{
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],
                ['link', 'image', 'video'],
                ['clean']                                         // remove formatting button
            ],
            handlers: {
                'image': function (value) {
                    var finputer = document.createElement("input")
                    finputer.type="file"
                    finputer.multiple='multiple'
                    finputer.accept='image/*'
                    console.log(this)
                    finputer.onchange=function(e){
                        that.uploadFiles(value,this,e)
                    }
                    finputer.click()
                }
            }
        }
    }
}