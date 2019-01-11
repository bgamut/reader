var fs = require('fs')
var spawn =require('child_process').spawn


var inputPath = '/Users/bernardahn/Desktop/development/software/webapp/reader/temp/jpeg/jimptest.jpg'
var language = 'ENG'
/*
var inputPath = '/Users/bernardahn/Desktop/development/software/webapp/reader/temp/jpeg/3.jpeg'
var language = 'KOR'
*/
//below is a txt file path minus the file extension
var outputPath = '/Users/bernardahn/Desktop/development/software/webapp/reader/temp/tesseractTest'

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
var englishtext = fs.readFileSync(__dirname+'/temp/tesseractTest.txt','ascii')
var koreantext = fs.readFileSync(__dirname+'/temp/tesseractTest.txt','utf8')
console.log(englishtext)