var fs = require('fs')
var path = require('path')
var spawn =require('child_process').spawn

var inputPath = process.argv[2]
var language = process.argv[3]
var currentPage = process.argv[4]
if(language == undefined){
    language='KOR'
    //language='ENG'
}

//var outputPath = __dirname+'/./../temp/txt/'+currentPage
var outputPath = '/Users/bernardahn/Desktop/txt/'+currentPage
var args = [
    inputPath,
    outputPath,
    '-l',language
]
var runningman = spawn('tesseract',args,{stdio:'ignore'})
/*
var englishtext = fs.readFileSync('/Users/bernardahn/Desktop/development/software/webapp/reader/temp/tesseractTest.txt','ascii')
var koreantext = fs.readFileSync('/Users/bernardahn/Desktop/development/software/webapp/reader/temp/tesseractTest.txt','utf8')
*/
