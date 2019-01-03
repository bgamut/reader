const path = require('path')
module.exports={
    entry:'./import.js',
    externals:{
        'electron':require('electron'),
        'fs':require('fs'),
        'path':require('path'),
        'pdf-text-extract':require('pdf-text-extract')

    },
    output:{
        filename:'webpack.js',
        path: path.resolve(__dirname,'dist')
    },
    target:'electron-renderer',
    mode:'development'
}